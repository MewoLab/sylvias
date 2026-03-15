- Review the [Two-Torial guide](https://two-torial.maimaidxprism.plus/games/sega/ongeki/refresh/setup/) 
- Make sure you have `mu3.ini` in your `App/package` folder (example below, more information on Two-Torial):
```ini
[AM]
IgnoreError=1
OptionDev=0
DummyAime=0
DummyCredit=1
DummyJVS=0

[Sound]
WasapiExclusive=0
```
- Make sure the [Visual Studio C++ Redistributable](https://github.com/abbodi1406/vcredist/releases) and [DirectX Runtime](https://www.microsoft.com/en-us/download/details.aspx?id=8109) are installed correctly
-# (You must fully extract it into a folder AND install via the `dxsetup.exe` that it adds. Just extraction is NOT enough.)
- Ensure you have an `ICF1` file in your `amfs` folder
- Ensure you do not have protected game executables (they must be unpacked) and that your `Assembly-CSharp.dll` file is the correct version for your game

Attaching your `segatools.ini` file **with the keychip section removed** and any notable errors or logs will improve assistance.