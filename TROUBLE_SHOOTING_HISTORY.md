### 1. 웹스톰에서 prettier 활성화

[apply-Prettier-in-webstorm](https://choonse.com/tag/prettier/)

### 2. wsl2 docker 설정

[reference](https://docs.docker.com/desktop/wsl/)

- `$ wsl.exe --set-default-version 2`

### 3. wsl2 host 설정

- wsl2 에서 host 설정만 해줘도 동작하지 않는다.
- 관리자모드로 cmd나 powershell을 켜서 `Windows/system32/drivers/etc` 경로에 들어간다
  - `$ notepad hosts` 명령어로 여기에도 host 설정으로 해준다
  - `$ ipconfig /flushdns` 명령어로 젹용
  - `$ netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=` <- 여기에는 wsl2 ip
    - wsl2에서 `$ ip addr show` 로 찾아낼 수 있음
  - wsl2 에서도 host 세팅
