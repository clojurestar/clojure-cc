import os
import re
import time

_BUST = str(int(time.time()))
_TAG_PATTERN = re.compile(
    r'(<meta\s+(?:property|name)="(?:og|twitter):image"\s+content="[^"]+?/assets/images/social/[^"]+?)(\.png)(")'
)


def on_post_page(output, page, config):
    return _TAG_PATTERN.sub(rf'\1-{_BUST}\2\3', output)


def on_post_build(config):
    social_dir = os.path.join(config["site_dir"], "assets", "images", "social")
    if not os.path.isdir(social_dir):
        return
    suffix = f"-{_BUST}.png"
    for name in os.listdir(social_dir):
        if name.endswith(".png") and not name.endswith(suffix):
            src = os.path.join(social_dir, name)
            dst = os.path.join(social_dir, name[:-4] + suffix)
            os.rename(src, dst)
