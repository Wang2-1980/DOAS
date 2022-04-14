* [配置流程](#配置流程)
  * [1 光谱准备和格式转换](#1-光谱准备和格式转换)
    * [1\.1 光谱数据获取](#11-光谱数据获取)
    * [1\.2 光谱转格式](#12-光谱转格式)
  * [2 QDOAS基本配置](#2-qdoas基本配置)
    * [2\.1 地点配置](#21-地点配置)
    * [2\.2 仪器校准文件格式转换和配置](#22-仪器校准文件格式转换和配置)
    * [2\.3 标准谱配置](#23-标准谱配置)
    * [2\.4 基本配置文件准备](#24-基本配置文件准备)
    * [2\.5 文件对应配置](#25-文件对应配置)
  * [3 光谱生成和处理](#3-光谱生成和处理)
    * [3\.1 光谱生成](#31-光谱生成)
    * [3\.2 gap去除](#32-gap去除)
    * [3\.3 校准文件的替换](#33-校准文件的替换)
  
## 配置流程

### 1 光谱准备和格式转换

#### 1.1 光谱数据获取

首先找到需要分析的光谱，在spectra——Uv(ultra voilet) 里找到某一天的具体光谱，可以在东区塔式服务器下载相关光谱文件夹SN1804011U1和对应的非线性文件，在Nonlinearity文件夹里找到.txt文件。

#### 1.2 光谱转格式

> 这一步需要在2.2的配置文件之后生成校准文件后进行

打开sp2_to_std_nonlinear_dc_ofs.js文件，将InPath_U后面的路径改为光谱数据所在的位置，将OutPath_U的路径改为输出的位置路径；FirstNumber和LastNumber分别改为光谱数据的文件名；sCalibPath改为校准文件所在位置路径（注意路径最后加\\\\)，sOffetFile, sDarSpecRaw_V改为该文件夹下的文件名称；pNonLinPoly_U为获取的非线性文件的数据，在Airyx skySpec 01027 Avantes SN 180401101 Nonlinearity中打开的数据倒序输入；

> 注意所有的位置路径都需要用双\\\\来隔开

在doasis应用里下方的工作窗口选择Script，按路径选择sp2_to_std_nonlinear_dc_ofs.js，然后运行得到std格式的光谱数据。

> 如果未显示工作窗口，则在View一栏（注意使用需要重新打开），则选择Ducking Windows，选择Reset。



### 2 QDOAS基本配置

#### 2.1 地点配置

打开qdoas.exe文件，qdoas_cl.exe为脚本使用的文件；

File-Open打开qdoas_daily_all.xml文件；

重命名项目名称，在Projects栏右击string_need_to_change点击edit，直接修改；

在Site栏右击点击insert，插入观测地点，右击string_need_to_change，点击edit修改地点名称，和经纬度及高度信息，可在地基MAX-DOAS观测网络仪器信息表格里查找相关信息，经纬度影响太阳天顶角；

右击项目名称，点击Properties；

在instrumental一栏选择Site，配置为刚刚创建的相应的地点；

#### 2.2 仪器校准文件格式转换和配置

在doasis应用里用Hg_UO008499_calibrated_solar.std文件，在Math一栏选择Gauss Fit，FWHM(Full Width at Half Maximum)为半宽高对应数值，并另存为.clb格式的文件，得到2048通道各自对应的的波长；

在instrumental一栏的Calibration File选择仪器特有的校准信息，即为上一步生成的clb文件，并填写相应的半宽高信息；

#### 2.3 标准谱配置

在Display一栏的Plot勾选所有选项；

在Calibration一栏的Solar Ref File点击Browse选择sao2010_solref_air.dat文件，确定太阳的标准谱；

在Slit一栏的Solar Ref File点击Browse选择sao2010_solref_air.dat文件；

在Output一栏选择输出文件的路径和格式，新建一个txt文件用来输出数据；

#### 2.4 基本配置文件准备

选择工具栏的Tools，选择Convolution，在Convolution选择为Stardard格式，solar_ref一处选择sao2010_solref_air.dat文件，Calibration选择之前生成的Hg_UO008499_calibrated_solar.clb文件，在input分别选择导入的三个文件new_solar.txt, output选择一个新的文件名，在Slit一栏的Slit Function Type选择Gaussian，填写半高宽信息，和之前的FWHM数值相同；在Calculate一栏选择Run_Convolution；对solar.txt, raman.txt, O3_223K_SDY_air.xs和O3_293K_SDY_air.xs四个文件重复操作；卷积的意义在于把标准谱的波长转变为.clb的波长。

选择工具栏的Ring，solar_ref处选择sao2010_solref_air.dat文件，Calibration选择之前生成的Hg_UO008499_calibrated_solar.clb文件，Output新建ring_a.xs, Slit Function Type选择Gaussian，填写半高宽信息，和之前的FWHM数值相同；点击Calculate，输出文件。

将new_solar.txt, solar.txt, raman.txt的内容整合到同一个表格当中，算出raman/new_solar-raman/solar的数值，注意保存格式为小数保存，科学计数保存会出问题，生成ringa_con.txt文件

#### 2.5 文件对应配置

在Analysis Windows里的某个反演气体可以选择特征，确定波长范围，并对于反演分子的Molecules的气体右击选择XS Filename，找到对应的表格文件，注意ringa是刚刚得到的文件；

在项目的Properties的Calibration一栏里的Molecules的三个：Ring, O3_293, O3右击选择XS Filename分别选择上一步生成的对应的文件；



### 3 光谱生成和处理

#### 3.1 光谱生成

右击Raw Spectra，选择insert directory，选择光谱文件对应的路径，注意勾选insert sub-directories；

右击Raw Spectra，选择Browse Spectra，再次选择Run Analysis，并且点击上方的运行按钮，生成图像，注意有的图片有gap尖刺，需要进行处理去除；

？？？怎么放大图像

#### 3.2 gap去除

放大Residual图像区域得到gap的波长范围，右击Analysis Windows的对应气体，选择Gaps栏，右击选择insert，输入刚刚得到的gap范围；

在项目名称右击选择properties，在Calibration一栏下的Gaps同样insert对应的波长范围；

#### 3.3 校准文件的替换

在生成的图像窗口右击选择Save as，生成表格，仅保留第一列；

在Properties的Calibration一栏的校准文件选择生成的表格，进行校准，弥补仪器的漂移；

> 理论上需要改动的还有Convolution所生成的几个文件，但实际影响不大

