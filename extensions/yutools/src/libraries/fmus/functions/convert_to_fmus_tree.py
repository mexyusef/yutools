def convert_to_fmus_tree(tree_string: str) -> str:
    lines = tree_string.strip().split("\n")
    fmus_result = "--% index/fmus\n"
    
    def process_line(line: str, indent_level: int) -> str:
        stripped_line = line.strip()
        if stripped_line.endswith("/"):  # Directory
            dir_name = stripped_line[:-1]
            return f"{'  ' * indent_level}{dir_name},d\n"
        else:  # File
            file_name = stripped_line
            return f"{'  ' * indent_level}{file_name},f(e=__SOURCE_FILE__={file_name})\n"
    
    for line in lines:
        indent_level = (len(line) - len(line.lstrip())) // 2
        fmus_result += process_line(line, indent_level)
    
    fmus_result += "--#"
    return fmus_result
