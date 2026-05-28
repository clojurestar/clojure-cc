import re
import time

_BUST = str(int(time.time()))
_TAG_PATTERN = re.compile(
    r'(<meta\s+(?:property|name)="(?:og|twitter):image"\s+content="[^"]+?/assets/images/social/[^"]+?\.png)(")'
)


def on_post_page(output, page, config):
    return _TAG_PATTERN.sub(rf'\1?v={_BUST}\2', output)
