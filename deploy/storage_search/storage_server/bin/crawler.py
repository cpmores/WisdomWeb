import sys
import os
import json
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

def main():
    if len(sys.argv) < 4:
        print("Usage: python crawler.py url mytag myuser")
        exit(0)
    
    url = sys.argv[1]
    mytag = sys.argv[2]
    myuser = sys.argv[3]

    basedir = "../data"
    dir = os.path.join(basedir, myuser)
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname
    pathname = parsed_url.path

    # make dir first
    host_dir = os.path.join(dir, hostname)

    clean_path = pathname.lstrip('/').rstrip('/')

    if not clean_path:
        clean_path = "index"

    print(clean_path)

    filename = ""
    path_parts = clean_path.split('/')
    # if only one level
    if len(path_parts) == 1 and path_parts[0]:
        filename = os.path.join(host_dir, f"_{path_parts[0]}.txt")
    else:
        filename = os.path.join(host_dir, *path_parts[:-1], f"_{path_parts[-1]}.txt")

    response = requests.get(url)
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    invalid_tags = ['script', 'iframe', 'style']
    
    def traverse_node(node, text_loader=None, count=None):
        if text_loader is None:
            text_loader = []
        if count is None:
            count = [0]
            
        if node.name in invalid_tags:
            return text_loader
            
        if hasattr(node, 'children'):
            for child in node.children:
                traverse_node(child, text_loader, count)
        elif isinstance(node, str):
            text_content = node.strip()
            if text_content:
                text_loader.append(text_content)
                count[0] += 1
                
        return text_loader

    def add_url_meta(url, myuser, dir):
        url_filename = os.path.join(dir, myuser, "url_meta.json")
        url_past_json = {}
        
        if os.path.isfile(url_filename):
            with open(url_filename, 'r') as f:
                url_past_json = json.load(f)
                
            if myuser in url_past_json:
                user_meta = url_past_json[myuser]
                user_meta["urlId"][url] = user_meta["urlCount"]
                user_meta["Idurl"][str(user_meta["urlCount"])] = url
                user_meta["urlCount"] += 1
            else:
                user_meta = {
                    "urlCount": 1,
                    "urlId": {url: 0},
                    "Idurl": {"0": url}
                }
        else:
            user_meta = {
                "urlCount": 1,
                "urlId": {url: 0},
                "Idurl": {"0": url}
            }
            
        url_past_json[myuser] = user_meta
        with open(url_filename, 'w') as f:
            json.dump(url_past_json, f, indent=2)

    def add_meta(url, myuser, mytag, dir, filename):
        meta_filename = os.path.join(dir, myuser, "meta.json")
        past_json = {}
        
        if os.path.isfile(meta_filename):
            with open(meta_filename, 'r') as f:
                past_json = json.load(f)
                
            if myuser in past_json:
                user_past_meta = past_json[myuser]
            else:
                user_past_meta = []
                
            flag = True
            for web in user_past_meta:
                if web["url"] == url:
                    web["tag"] = mytag
                    flag = False
                    break
                    
            if flag:
                user_past_meta.append({
                    "tag": mytag,
                    "url": url,
                    "path": filename,
                    "is_inverted": False,
                    "is_trie": False
                })
                add_url_meta(url, myuser, dir)
        else:
            user_past_meta = [{
                "tag": mytag,
                "url": url,
                "path": filename,
                "is_inverted": False,
                "is_trie": False
            }]
            add_url_meta(url, myuser, dir)
            
        past_json[myuser] = user_past_meta
        
        with open(meta_filename, 'w') as f:
            json.dump(past_json, f, indent=2)

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        body = soup.body

        text_loader = traverse_node(body)
        
        metadata = [f"url: {url}", f"user: {myuser}", f"tag: {mytag}"]
        
        add_meta(url, myuser, mytag, basedir, filename)
        
        content = "\n".join(text_loader)
        final_content = "\n".join(metadata) + "\n" + content + "\n"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(final_content)
            
        print(f"Save '{filename}' finished")
    else:
        print(f"Failed, return code: {response.status_code}")

if __name__ == "__main__":
    main()