import os
import re
import requests
import json
from bs4 import BeautifulSoup

def scrape_marvel_movies():
    url = "https://editorial.rottentomatoes.com/guide/marvel-movies-in-order/"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print("Erro ao acessar a página")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    movies = []
    
    for movie_section in soup.find_all("div", class_="countdown-item"):  
        title = movie_section.find("div", class_="article_movie_title").text.strip() if movie_section.find("div", class_="article_movie_title") else "N/A"
        year = movie_section.find("span", class_="start-year").text.strip("()").strip() if movie_section.find("span", class_="start-year") else "N/A"      
        ranking = movie_section.find("div", class_="countdown-index").text.strip() if movie_section.find("div", class_="countdown-index") else "N/A"
        image = movie_section.find("img", class_="article_poster")['src'] if movie_section.find("img", class_="article_poster") else "N/A"
        
        movies.append({
            "Ranking": ranking,
            "Título":  re.sub(r"\s*\(.*?\)", "", title.rsplit(' ', 2)[0].strip('\n').replace("\n", " ")),
            "Tomatometro": title.rsplit(' ', 2)[1].strip('\n'),
            "Pipocometro": title.rsplit(' ', 2)[2],
            "Ano": year,
            "Imagem": image
        })
    
    return movies

def save_to_json(data, filename="marvel_movies.json", folder="data"):
     os.makedirs(folder, exist_ok=True)
     filepath = os.path.join(folder, filename)

     with open(filepath, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
        
if __name__ == "__main__":
    marvel_movies = scrape_marvel_movies()
    save_to_json(marvel_movies)
    print(f"Dados salvos em marvel_movies.json")
