import os
from random import randrange

from config import settings
from .datastore import MATERIAL_ICON_LISTS

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


def get_static(files: list, dev=False, folders=('', 'react', 'vue', 'css')):
    """
    Returns list of static files. The list will be passed to flask which will then render them in HTML.
    This way, static files are called automatically.
    :param files: files to be called in base template
    :param dev: get static files in dev mode
    :param folders: default folders to get from
    :return: List of static file names
    """

    static_folder = os.path.join(__BASE_DIR, 'CodeQuiz', 'static')

    prefix = "/static"
    if dev:
        print("Using Local Services, DEV MODE")
        # prefix = settings.WEBPACK_DEV_SERVER + '/'

    js = []
    css = []
    for h in folders:
        for i in os.listdir(os.path.join(static_folder, h)):
            for j in files:
                f = prefix + '/' + h + '/' + i # if not dev else prefix + i
                if i.endswith('.js') and j in i:
                    js.append(f)
                    break
                elif i.endswith('.css') and j in i:
                    css.append(f)
                    break
    return js, css

