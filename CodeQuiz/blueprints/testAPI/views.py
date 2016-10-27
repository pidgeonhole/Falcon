from flask import Blueprint, jsonify, render_template, request

from utils.funcs import get_icon

testAPI = Blueprint('testAPI', __name__, template_folder='templates')


@testAPI.route('/test_questions/')
def list_of_questions():
    questions = {
        "Dynamic Programming": ["Question 1", "Question 2"],
        "Path Problems"      : ["Djikstra's Algorithm", "Bellman Ford"]
    }
    return jsonify(questions)


@testAPI.route('/question', methods=["POST"])
def question():
    return render_template('questions/question1.md')


@testAPI.route('/solution')
def solution():
    s1 = """
def func(p=0, current=0):
    if current > 200:
        return 0
    if current == 200:
        return 1
    coins = (1, 2, 5, 10, 20, 50, 100, 200)
    return sum([func(i, current+i) for i in coins if i >= p])
"""
    s2 = """
def func(target):
    coins = (1, 2, 5, 10, 20, 50, 100, 200)
    ways = [0] * (target + 1)
    ways[0] = 1
    for i in coins:
        for j in range(i, target + 1):
            ways[j] += ways[j-i]
    return ways[-1]
    """
    return jsonify({"solutions": [s1, s2]})


@testAPI.route('/get_icons')
def get_icons(n):
    return jsonify(list(get_icon(n)))


@testAPI.route('/somehtml')
def get_html():
    return render_template('questions/question1.md')


@testAPI.route('/submit', methods=["POST"])
def submit():
    content = request.get_json(force=True)
    print(content)
    return jsonify({
        'body': 'Success'
    })