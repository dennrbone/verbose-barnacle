import os
import json
import re
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gigachat import GigaChat
from gigachat.models import Chat

app = FastAPI(title="Recipe Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GIGACHAT_CREDENTIALS = "MDE5ZGVlZDMtZjZmMC03ZGMyLTgwNzQtMDhjZWVjYzg5N2Q5OjdmNmRmYzJkLTYxZDYtNGJhNy1hODMzLWM3MGE1ZWNmNzBmNg=="

PROMPT = (
    "Ты шеф-повар. Твоя задача — составить ровно 3 разных пошаговых рецепта на выбор на основе переданных ингредиентов или изображения.\n"
    "Ты должен вернуть ответ СТРОГО в формате JSON, соответствующем следующей схеме:\n"
    "{\n"
    "  \"recipes\": [\n"
    "    {\n"
    "      \"title\": \"Название блюда\",\n"
    "      \"time\": \"Время приготовления\",\n"
    "      \"ingredients\": [\"Ингредиент 1\", \"Ингредиент 2\"],\n"
    "      \"steps\": [\"Шаг 1\", \"Шаг 2\"]\n"
    "    }\n"
    "  ]\n"
    "}\n"
    "Не пиши никаких вступлений, пояснений или разметки markdown (типа ```json). Только чистый JSON-объект."
)

@app.post("/api/recipe")
async def generate_recipe(
    text_ingredients: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None)
):
    if not text_ingredients and not image_file:
        raise HTTPException(status_code=400, detail="Передайте текст или изображение.")

    with GigaChat(credentials=GIGACHAT_CREDENTIALS, verify_ssl_certs=False) as client:
        messages = [
            {"role": "system", "content": PROMPT}
        ]
        
        if image_file:
            try:
                file_content = await image_file.read()
                uploaded_image = client.upload_file(
                    (image_file.filename, file_content, image_file.content_type), 
                    purpose="general"
                )
                
                user_content = "Что приготовить из продуктов на этом фото? Ответ сформируй строго по JSON-схеме из системного промпта."
                if text_ingredients:
                    user_content += f" Также учти эти ингредиенты: {text_ingredients}"
                    
                messages.append({
                    "role": "user",
                    "content": user_content,
                    "attachments": [uploaded_image.id_]
                })
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ошибка обработки изображения: {str(e)}")
        else:
            messages.append({
                "role": "user", 
                "content": f"Ингредиенты: {text_ingredients}. Ответ сформируй строго по JSON-схеме из системного промпта."
            })

        try:
            response = client.chat(Chat(messages=messages, model="GigaChat-Max")) 
            raw_text = response.choices[0].message.content.strip()
            
            # Удаляем markdown-обёртку, если GigaChat её добавил
            if raw_text.startswith("```"):
                raw_text = re.sub(r'^```[a-zA-Z]*\n|```$', '', raw_text, flags=re.MULTILINE).strip()
            
            recipe_data = json.loads(raw_text)
            recipes_list = recipe_data.get("recipes", [])
            
            return {
                "success": True, 
                "count": len(recipes_list),
                "recipes": recipes_list
            }
        except json.JSONDecodeError as je:
            raise HTTPException(
                status_code=500, 
                detail=f"Нейросеть вернула некорректный формат JSON. Ошибка: {str(je)}. Текст ответа: {raw_text}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка GigaChat API: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)