from random import randrange

from .datastore import MATERIAL_ICON_LISTS


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
