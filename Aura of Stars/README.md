# 免登入版

Double-click `Aura-of-Stars-offline.html`. It includes the interface and chart engine in one file, needs no login or localhost service, and never saves data. The 免登入版 uses standard time and does not display coordinate or true-solar-time fields. Closing or refreshing the page discards the current input.

After source changes, regenerate the single-file edition with `node build-offline.mjs` and validate it with `node verify-offline.mjs`.
