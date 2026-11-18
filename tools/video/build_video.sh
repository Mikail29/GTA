#!/bin/bash
# Baut aus frames/sNN.png ein Hochkant-Video mit Überblendungen. Aufruf: build_video.sh frames out.mp4 [sekunden_pro_folie]
set -e
DIR=$1; OUT=$2; D=${3:-5.5}; T=0.6
FILES=($(ls $DIR/s*.png | sort)); N=${#FILES[@]}
ARGS=(); for f in "${FILES[@]}"; do ARGS+=(-loop 1 -t $D -i "$f"); done
FILTER=""; PREV="[0:v]"; OFF=0
for ((i=1;i<N;i++)); do
  OFF=$(python3 -c "print(round($i*($D-$T),3))")
  FILTER+="${PREV}[$i:v]xfade=transition=slideleft:duration=$T:offset=$OFF[v$i];"; PREV="[v$i]"
done
TOTAL=$(python3 -c "print(round($N*$D-($N-1)*$T,3))")
ffmpeg -y -loglevel error "${ARGS[@]}" -f lavfi -t $TOTAL -i anullsrc=r=44100:cl=stereo \
  -filter_complex "${FILTER%;}" -map "$PREV" -map $N:a -r 30 -c:v libx264 -pix_fmt yuv420p -preset medium -crf 20 -c:a aac -shortest -movflags +faststart "$OUT"
echo "$OUT ($TOTAL s)"
