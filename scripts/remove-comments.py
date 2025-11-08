#!/usr/bin/env python3
import re
import sys

def remove_comments(content):
    # Remove single-line comments (// ...)
    content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
    
    # Remove multi-line comments (/* ... */)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Remove empty lines
    lines = [line for line in content.split('\n') if line.strip()]
    
    return '\n'.join(lines)

if __name__ == '__main__':
    input_file = 'contracts/Web3TwinNFT_flattened_clean.sol'
    output_file = 'contracts/Web3TwinNFT_flattened_no_comments.sol'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove file header comments but keep pragma
    # Find the first pragma statement
    pragma_match = re.search(r'pragma solidity[^;]+;', content)
    if pragma_match:
        # Keep everything from the first pragma onwards
        content = content[pragma_match.start():]
    
    cleaned = remove_comments(content)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    
    print(f"Cleaned file written to {output_file}")
    print(f"Original lines: {len(content.split(chr(10)))}")
    print(f"Cleaned lines: {len(cleaned.split(chr(10)))}")

