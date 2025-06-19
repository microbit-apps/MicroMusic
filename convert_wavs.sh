#!/bin/bash

# This script converts all wav files in a directory to 8800hz and puts the hex values into a typescript file with a way to access them

INPUT_DIR=""
OUTPUT_FILE=""

echo "// Auto-generated TypeScript file with WAV samples as tagged hex buffers" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

declare -a varnames=()

for file in "$INPUT_DIR"/*.wav; do
  filename=$(basename -- "$file")
  varname=$(echo "${filename%.*}" | tr '.-' '__')

  echo "Processing $filename..."

  hex_string=$(sox "$file" -t raw -r 8800 -c 1 -b 8 -e unsigned-integer - | xxd -p | tr -d '\n')
  echo "const $varname = hex\`$hex_string\`;" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  varnames+=("$varname")
done

# Generate sampleMap and utility functions
echo "const sampleMap: Record<string, Buffer> = {" >> "$OUTPUT_FILE"
for name in "${varnames[@]}"; do
  echo "  $name," >> "$OUTPUT_FILE"
done
echo "};" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "export function getSample(name: string): Buffer | undefined {" >> "$OUTPUT_FILE"
echo "  return sampleMap[name];" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "export function listSamples(): string[] {" >> "$OUTPUT_FILE"
echo "  return Object.keys(sampleMap);" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "✅ Done! TypeScript file written to $OUTPUT_FILE"
