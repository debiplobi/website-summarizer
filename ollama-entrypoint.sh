#!/bin/sh

echo "⏳ Starting Ollama serve..."
ollama serve &                              # start in background
PID=$!

# wait until Ollama API is ready
until ollama list >/dev/null 2>&1; do
  echo "Waiting for Ollama to be ready..."
  sleep 1
done

echo "✔️ Ollama ready!"

# pull models
ollama pull llama3.2:3b

wait $PID                                  # keep server running
