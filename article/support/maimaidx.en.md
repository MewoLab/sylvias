- Review the [Two-Torial guide](https://two-torial.maimaidxprism.plus/games/sega/maimai/circle/setup/) 
- Make sure you have `mai2.ini` in your `App/package` folder (example below, more information on Two-Torial):
```ini
[Debug]
Debug=1

[AM]
Target=0
IgnoreError=1
DummyTouchPanel=1
DummyLED=1
DummyCodeCamera=1
DummyPhotoCamera=1

[Sound]
Sound8Ch=0
```
- Make sure the [Visual Studio C++ Redistributable](https://github.com/abbodi1406/vcredist/releases) and [DirectX Runtime](https://www.microsoft.com/en-us/download/details.aspx?id=8109) are installed correctly
-# (You must fully extract it into a folder AND install via the `dxsetup.exe` that it adds. Just extraction is NOT enough.)
- Ensure you have an `ICF1` file in your `amfs` folder
- It is recommended you install AquaMai for QoL
- Ensure you do not have protected game executables (they must be unpacked) and that your `Assembly-CSharp.dll` file is the correct version for your game

Attaching your `segatools.ini` file **with the keychip section removed** and any notable errors or logs will improve assistance.