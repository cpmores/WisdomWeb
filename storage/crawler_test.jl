using HTTP
using Gumbo
using Cascadia
using FileIO
using URIs
using JSON

# url = "https://zjuers.com/"
url = "https://github.com/cpmores/RayTracingInOneWeekend_JuliaCUDAver/tree/main/src"
mytag = "Math"
myuser = "Admin"

basedir = "./data"
dir = joinpath(basedir, myuser)
uri = URI(url)
hostname = uri.host
pathname = uri.path

# make dir first
host_dir = joinpath(dir, hostname)

clean_path = lstrip(pathname, '/')
clean_path = rstrip(clean_path, '/')

if isempty(clean_path)
    clean_path = "index"
end

println(clean_path)

filename = ""
path_parts = split(clean_path, '/')
# if only one level
if length(path_parts) == 1 && !isempty(path_parts[1])
    filename = joinpath(host_dir, "_$(path_parts[1]).txt")
else
    filename = joinpath(host_dir, path_parts[1:end-1]..., "_$(path_parts[end]).txt")
end

@time response = HTTP.get(url)
mkpath(dirname(filename))

invalid_tag = [:script, :iframe, :style]
function traverse_node(node, depth=0, text_loader=String[], count=Ref(0))
    if isa(node, HTMLElement)

        if tag(node) in invalid_tag
            return text_loader
        end

        # println(" "^depth * "Tag: $(tag(node))")

        for child in children(node)
            traverse_node(child, depth + 1, text_loader, count)
        end
    elseif isa(node, HTMLText)
        text_content = strip(node.text)
        if !isempty(text_content)
            # println(" "^depth * "Text: $text_content")
            push!(text_loader, "$text_content")
            count[] += 1
        end
    end

    return text_loader
end

function add_url_meta(url, myuser, dir) 
    url_filename = joinpath(dir, "url_meta.txt")
    url_past_json = Dict()
    
    if isfile(url_filename)
        url_fstring = read(url_filename, String)
        url_past_json = JSON.parse(url_fstring)
        if haskey(url_past_json, myuser) 
            user_meta = url_past_json[myuser]
            user_meta["urlId"][url] = user_meta["urlCount"]
            user_meta["Idurl"][String(user_meta["urlCount"])] = url;
            user_meta["urlCount"] = user_meta["urlCount"] + 1
        else
            user_meta = Dict("urlCount" => 1, "urlId" => Dict(url => 0), "Idurl" => Dict("0" => url))
        end
    else
        user_meta = Dict("urlCount" => 1, "urlId" => Dict(url => 0), "Idurl" => Dict("0" => url))
    end

    url_past_json[myuser] = user_meta
    open(url_filename, "w") do io
        JSON.print(io, url_past_json, 2)
    end
end

function add_meta(url, myuser, mytag, dir, path_parts)

    filename = joinpath(dir, "meta.txt")
    past_json = Dict()
    if isfile(filename)
        past_string = read(filename, String)
        past_json = JSON.parse(past_string)
        if haskey(past_json, myuser)
            user_past_meta = past_json[myuser]
        else
            user_past_meta = []
        end
        flag = true
        for web in user_past_meta
            if web["url"] == url
                web["tag"] = mytag
                flag = false
                break
            end
        end

        if flag
            push!(user_past_meta, Dict("tag" => mytag, "url" => url, "path" => path_parts, "is_inverted" => false, "is_trie" => false))
            add_url_meta(url, myuser, dir)
        end
    else
        user_past_meta = [Dict("tag" => mytag, "url" => url, "path" => path_parts, "is_inverted" => false, "is_trie" => false)]
        add_url_meta(url, myuser, dir)
    end

    past_json[myuser] = user_past_meta

    open(filename, "w") do io
        JSON.print(io, past_json, 2)
    end



end


if response.status == 200
    html = String(response.body)

    parsed = parsehtml(html)

    selector = Selector("body")
    body = first(eachmatch(selector, parsed.root))

    text_loader = traverse_node(body)

    metadata = ["url: $url", "user: $myuser", "tag: $mytag"]

    add_meta(url, myuser, mytag, basedir, filename)

    content = join(text_loader, "\n")
    final_content = join(metadata, "\n") * "\n" * content * "\n"

    write(filename, final_content)

    println("Save '$filename' finished")
else
    println("Failed, return code: ", response.status)
end
