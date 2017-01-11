import os
from collections import deque
from random import randrange
from urllib.parse import urljoin

from flask import request

from .u_datastore import MATERIAL_ICON_LISTS

__BASE_DIR = os.path.join(os.path.dirname(__file__), '..')


def get_icon(n: int = 1):
    if n < 1:
        raise ValueError("n must be > 1")
    num_pics = len(MATERIAL_ICON_LISTS)
    icons = {MATERIAL_ICON_LISTS[randrange(num_pics)]}
    while n > 1:
        pic = MATERIAL_ICON_LISTS[randrange(num_pics)]
        if pic not in icons:
            icons.add(pic)
            n -= 1

    return icons


def get_static(exc=(), folders=('vue', 'css')):
    """
    Returns list of static files. The list will be passed to flask which will then render them in HTML.
    This way, static files are called automatically.
    :param exc: explicitly excluded files
    :param folders: default folders to get from
    :return: List of static file names
    """

    prefix = os.environ.get('FRONTEND', '')

    static_folder = os.path.join(__BASE_DIR, 'CodeQuiz', 'static')
    js = deque()
    css = deque()

    for folder in folders:

        if prefix and folder == 'vue':
            continue

        for _file in os.listdir(os.path.join(static_folder, folder)):

            if _file in exc:
                continue
            file_path = '/static/%s/%s' % (folder, _file)

            if _file.endswith('.js'):
                if _file.startswith("shared"):
                    js.appendleft(file_path)
                else:
                    js.append(file_path)
            elif _file.endswith('.css'):
                css.append(file_path)

    if prefix:
        for _file in ['admin', 'common']:
            js.append('%s/static/vue/%s.js' % (prefix, _file))

    return js, css


def get_vendor_files():
    vendors = os.path.join(__BASE_DIR, 'CodeQuiz', 'static', 'vendors')

    js, css = deque(), []

    for library in os.listdir(vendors):

        if library in {'prism'}:
            continue

        for name in os.listdir(os.path.join(vendors, library)):
            path = "/static/vendors/{library}/{name}".format(library=library, name=name)

            if name.endswith('.css'):
                css.append(path)
                continue

            if name.startswith('jquery'):
                js.appendleft(path)
                continue

            elif name.startswith('tether'):
                if js[0].endswith('jquery.js'):
                    js.insert(1, path)
                else:
                    js.appendleft(path)
                continue

            else:
                js.append(path)

    return js, css


def safe_url(url):
    """
    Ensures a relative url path is on the same domain (i.e. pidgeonhole.spaces). Prevents open redirect attacks
    :param url: relative url
    :return: safe url path
    """
    return urljoin(request.host_url, url)
