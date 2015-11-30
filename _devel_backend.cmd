@set CYGWIN=nodosfilewarning
sh _devel_backend.sh %1 || bin\sh.exe _devel_backend.sh %1 || echo . && echo No POSIX Shell found! && echo Use git-for-windows.github.io for development under MS Windows(R)
pause
