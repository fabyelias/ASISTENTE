from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup

google = Blueprint('google', __name__)

@google.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({"message": "Query parameter is required"}), 400

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(f'https://www.google.com/search?q={query}', headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = []
    for g in soup.find_all('div', class_='BNeawe vvjwJb AP7Wnd'):
        results.append(g.get_text())

    return jsonify(results)