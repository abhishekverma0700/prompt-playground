import requests
import time
from config import Config

class LLMService:
    
    def __init__(self):
        self.api_key = Config.GROQ_API_KEY
        self.model = Config.GROQ_MODEL
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
    
    def generate(self, user_prompt, system_prompt="", temperature=0.7, 
                 max_tokens=1024, top_p=1.0, stop=None):
        """
        Groq API ko call karta hai aur response return karta hai
        """
        
        messages = []
        
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        
        messages.append({
            "role": "user", 
            "content": user_prompt
        })
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p,
        }
        
        if stop:
            payload["stop"] = stop
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Debug - API key check karo
        print(f" API Key: {self.api_key[:10]}..." if self.api_key else "❌ API Key missing!")
        print(f"Sending request to Groq...")
        print(f" Payload: {payload}")
        
        start_time = time.time()
        
        try:
            response = requests.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            response_time = round(time.time() - start_time, 2)
            
            # Response status print karo
            print(f" Response Status: {response.status_code}")
            print(f" Response Body: {response.text[:500]}")
            
            response.raise_for_status()
            
            data = response.json()
            output_text = data['choices'][0]['message']['content']
            
            usage = data.get('usage', {})
            input_tokens = usage.get('prompt_tokens', 0)
            output_tokens = usage.get('completion_tokens', 0)
            
            print(f" Success! Tokens used: {input_tokens + output_tokens}")
            
            return {
                'success': True,
                'output': output_text,
                'response_time': response_time,
                'input_tokens': input_tokens,
                'output_tokens': output_tokens,
                'total_tokens': input_tokens + output_tokens,
                'model': self.model
            }
            
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'error': 'Request timeout - 30 seconds mein response nahi aaya'
            }
            
        except requests.exceptions.ConnectionError:
            return {
                'success': False,
                'error': 'Connection error - Internet check karo'
            }
            
        except requests.exceptions.HTTPError as e:
            # Exact error body lo Groq se
            error_body = {}
            try:
                error_body = response.json()
            except:
                pass
            
            print(f" HTTP Error: {response.status_code}")
            print(f" Error Body: {error_body}")
            
            if response.status_code == 401:
                error_msg = 'Invalid API Key - .env file mein API key check karo'
            elif response.status_code == 429:
                error_msg = 'Rate limit exceeded - Thodi der baad try karo'
            elif response.status_code == 400:
                error_msg = f'Bad request: {error_body}'
            else:
                error_msg = f'API Error {response.status_code}: {error_body}'
                
            return {
                'success': False,
                'error': error_msg
            }
            
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def estimate_tokens(self, text):
        """
        Simple token estimation - 1 token ~ 4 characters
        """
        return len(text) // 4


llm_service = LLMService()