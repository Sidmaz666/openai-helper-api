# openai-helper-api
API to use OpenAI  Text Completion &amp; Image Generation.

# Endpoints

1. `/` -> `Text Completion`
2. `/generate_image` -> `Generate Image`
3. `/list_models` -> `List of available Models for Text Completion`


# Available Query

## 1. Text Completion `Endpoint -> / `
 
        1. model
        2. prompt
        3. rand
        4. max_result
        5. top_penalty
        6. frequency_penalty
        7. presence_penalty
        8. best_result
        9. stop_result
        
## 2. Image Generation `Endpoint -> /generate_image`

        1. prompt
        2. num
        3. size

# Environment Variables

	`SECRETKEY` = OpenAI API Secret Key
