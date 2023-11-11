import os
import re

def update_code_blocks(content):
    groups = re.findall(r"(.. code-section::\n.*.. code-block)", content)
    for group in groups:
        content = content.replace(group, "\n\n".join(group.split("\n")))
    return content

def update_tags(content):
    # Close <img> tags if it's not
    groups = re.findall(r"(<img(.*?)>)", content, flags=re.DOTALL)
    for group in groups:
        if group[1][-1] != "/":
            content = content.replace(group[0], "<img" + group[1] + "/>")

    # close <br> tags if it's not
    while match:=re.search(r'<br>(?!<\/br>)', content):
        i, j = match.span()
        content = content[:i] + "<br/>" + content[j:]

    return content


def fix_code_blocks(folder):
    # Get a list of all files in the input folder and its subfolders
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith('.rst'):
                rst_path = os.path.join(root, file)

                with open(rst_path, 'r') as f:
                    rst_content = f.read()

                rst_content = update_code_blocks(rst_content)
                with open(rst_path, 'w') as f:
                    f.write(rst_content)

if __name__ == "__main__":
    folder = 'docs/source/getting-started'

    fix_code_blocks(folder)

