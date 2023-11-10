import os
import subprocess
from distutils.dir_util import copy_tree


def update_md_content(content):
    content = content.replace("/_static/", "/../static/")
    return content

def convert_rst_to_md(input_folder, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Recreate the same folder structure in the output folder
    copy_tree(input_folder, output_folder)

    # Get a list of all files in the input folder and its subfolders
    for root, dirs, files in os.walk(output_folder):
        for file in files:
            if file.endswith('.rst'):
                rst_path = os.path.join(root, file)
                md_file = os.path.splitext(file)[0] + '.md'
                md_path = os.path.join(root, md_file)

                # Use pandoc to perform the conversion
                subprocess.run(['pandoc', rst_path, '-o', md_path])
                
                # with open(rst_path, 'r') as f:
                #     rst_content = f.read()
                # mdx_content = pypandoc.convert_text(rst_content, 'md', format='rst')
                # with open(md_path, 'w') as f:
                #     f.write(mdx_content)
                
                os.system("rm " + rst_path)
                
                with open(md_path, 'r') as f:
                    md_content = f.read()
                
                md_content = update_md_content(md_content)
                with open(md_path, 'w') as f:
                    f.write(md_content)

                print(f'Converted: {rst_path} -> {md_path}')


if __name__ == "__main__":
    input_folder = 'docs/source/getting-started/quickstart-1'
    output_folder = '../mlflow-hackathon-2023/website/docs/getting-started/quickstart-1'

    convert_rst_to_md(input_folder, output_folder)
