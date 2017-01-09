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


def get_static(files: list, exc=(), folders=('vue', 'css')):
    """
    Returns list of static files. The list will be passed to flask which will then render them in HTML.
    This way, static files are called automatically.
    :param files: files to be called in base template
    :param exc: excluded files
    :param folders: default folders to get from
    :return: List of static file names
    """

    prefix = os.environ.get('FRONTEND', '')

    static_folder = os.path.join(__BASE_DIR, 'CodeQuiz', 'static')
    js = deque()
    css = deque()

    for h in folders:

        if prefix and h == 'vue':
            continue

        for i in os.listdir(os.path.join(static_folder, h)):
            for listed_files in files:

                f = "/static/%s/%s" % (h, i)

                if i.endswith('.js') and listed_files in i and i.startswith(listed_files):
                    js.append(f)
                    break

                elif i.endswith('.css') and listed_files in i and i.startswith(listed_files):
                    css.append(f)
                    break

    if prefix and ('%s/static/vue/admin.js' % prefix) not in js:
        js.append('%s/static/vue/admin.js' % prefix)
        js.append('%s/static/vue/common.js' % prefix)
        # js.append('%s/static/vue/shared.js' % prefix)
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
