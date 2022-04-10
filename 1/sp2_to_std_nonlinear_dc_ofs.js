import System; // use the System libary of the .NET framework
import DoasCore; // use the DoasCore library
import DoasCore.Device; // use the Device namespace
import DoasCore.IO; // use the Input-/Output namespace
import DoasCore.Script; // use the Script namespace
import DoasCore.Spectra; // use the Spectra namespace
import DoasCore.Math;
import DoasCore.Math.Fit; 
import System.IO;


//****Just modify the following 5 lines****
var InPath_U= "D:\\softwares\\QDOAS\\2\\UV\\U0120500";
var InPath_V= "C:\\Beijing_qky\\spectra\\VIS";
var OutPath="outpath_need_to_change";
var FirstNumber= U0120500;
var LastNumber= U0120599;
var LogFileName="ConvertLog_skyspec_sky01155.log";
//****

var SOffsetSpec : ISpectrum = Specbar.GetSpectrum("ofs");
var SOffsetSpecRaw : ISpectrum = Specbar.GetSpectrum("ofsraw");
var SDarkSpec : ISpectrum = Specbar.GetSpectrum("dc");
var SDarkSpecRaw : ISpectrum = Specbar.GetSpectrum("dcraw");

var SOffsetSpec_V : ISpectrum = Specbar.GetSpectrum("ofs_V");
var SOffsetSpecRaw_V : ISpectrum = Specbar.GetSpectrum("ofsraw_V");
var SDarkSpec_V : ISpectrum = Specbar.GetSpectrum("dc_V");
var SDarkSpecRaw_V : ISpectrum = Specbar.GetSpectrum("dcraw_V");

var sCalibPath = "D:\\softwares\\QDOAS\\2\\SN1804011U1\\"
var sOffsetFile = "Offset_U0008493.std";
var sDCFile = "DC_UV.std";

var sOffsetFile_V = "Offset_V0003472.std";
var sDCFile_V = "DC_V0003475.std";

var pNonLinPoly_U = [1.024487568132465887e+00,-6.359845174766847137e-07,1.813648286914288708e-11,-7.673172116249873207e-16,1.098221991609104747e-20,-6.279343341965829491e-26];
var pNonLinPoly_V = [1.015502001090204720e+00,4.868392856474560344e-08,-2.425072199689546538e-11,6.885826016226376416e-16,-1.143277992908299495e-20,6.742704705983203174e-26];
var myspec = new SpectrumFile();
var Spec: ISpectrum;
var FileNumber;
var digit1, digit2, digit3, digit4, digit5, digit6, digit7;
var LogFile;
var Log;
var DateYYYYMMDD:String;
var CurrentDateTime;
var dispFileSystem = new ActiveXObject("Scripting.FileSystemObject");
LogFile = dispFileSystem.OpenTextFile(OutPath + "\\" + LogFileName,8,true);

 function correctDarkCurrentOffset(SOffsetSpecRaw,SDarkSpecRaw,SOffsetSpec,SDarkSpec){
	var SNSpec : ISpectrum = Specbar.GetSpectrum("N Spec");
	var SZSpec : ISpectrum = Specbar.GetSpectrum("Z Spec");
	// calculate actual offset and dark current spectra (and use some temp spectra)
	SOffsetSpecRaw .Copy (SNSpec, SpectrumCopyMode.SpectralData | SpectrumCopyMode.PropertiesDataPreserveName);
	SDarkSpecRaw   .Copy (SZSpec, SpectrumCopyMode.SpectralData | SpectrumCopyMode.PropertiesDataPreserveName);
	
	SOffsetSpecRaw .Copy (SOffsetSpec, SpectrumCopyMode.SpectralData | SpectrumCopyMode.PropertiesDataPreserveName);
	SDarkSpecRaw   .Copy (SDarkSpec, SpectrumCopyMode.SpectralData | SpectrumCopyMode.PropertiesDataPreserveName);
	
	SpecMath.CorrectOffset(SDarkSpec, SOffsetSpec);
    SpecMath.CorrectDarkCurrent(SOffsetSpec, SDarkSpec);

}

function nonlin(SCorrect: ISpectrum){

SCorrect.SuspendEvents();
  for(var i=0; i < SCorrect.NChannel; i ++){
	var x = SCorrect.Intensity[i] / SCorrect.NumScans ;
	
	var f = 1;
	
	f=0;
	for(var ii in pNonLinPoly_U){
		f = f + pNonLinPoly_U[ii] * Math.pow(x,ii);
	}
	
	
	// Console.WriteLine(f);
	SCorrect.Intensity[i] = SCorrect.Intensity[i] / f;
  }
  
  SCorrect.ResumeEvents();

return SCorrect;
}

/* function nonlin_V(SCorrect: ISpectrum){
//
SCorrect.SuspendEvents();
  for(var i=0; i < SCorrect.NChannel; i ++){
	var x = SCorrect.Intensity[i] / SCorrect.NumScans ;
	
	var f = 1;
	
	f=0;
	for(var ii in pNonLinPoly_V){
		f = f + pNonLinPoly_V[ii] * Math.pow(x,ii);
	}
//	
//	
//	// Console.WriteLine(f);
	SCorrect.Intensity[i] = SCorrect.Intensity[i] / f;
  }
  
  SCorrect.ResumeEvents();

return SCorrect;
} */

SOffsetSpec.Open(sCalibPath + sOffsetFile)
SOffsetSpecRaw.Open(sCalibPath + sOffsetFile)
SDarkSpec.Open(sCalibPath + sDCFile)
SDarkSpecRaw.Open(sCalibPath + sDCFile)

correctDarkCurrentOffset(SOffsetSpecRaw,SDarkSpecRaw,SOffsetSpec,SDarkSpec);

/* SOffsetSpec_V.Open(sCalibPath + sOffsetFile_V)
SOffsetSpecRaw_V.Open(sCalibPath + sOffsetFile_V)
SDarkSpec_V.Open(sCalibPath + sDCFile_V)
SDarkSpecRaw_V.Open(sCalibPath + sDCFile_V)

correctDarkCurrentOffset(SOffsetSpecRaw_V,SDarkSpecRaw_V,SOffsetSpec_V,SDarkSpec_V); */

for (FileNumber=FirstNumber;FileNumber<=LastNumber;FileNumber++){
	digit1=int(FileNumber/1000000);
	digit2=int(FileNumber/100000)-digit1*10;
	digit3=int(FileNumber/10000)-int(FileNumber/100000)*10;
	digit4=int(FileNumber/1000)-int(FileNumber/10000)*10;
	digit5=int(FileNumber/100)-int(FileNumber/1000)*10;
	digit6=int(FileNumber/10)-int(FileNumber/100)*10;
	digit7=FileNumber-int(FileNumber/10)*10;
//UV
	Spec = myspec.Open(InPath_U + "\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7);
	Log= InPath_U + "\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + " '" + Spec.Name + "' " + trimDate(Spec.StartDate) + " => ";
	Spec.AzimuthAngle=Math.round(parseFloat(changeName_new(Spec.Name).split(' ')[2]))
	Spec.Name=changeName(Spec.Name);
	DateYYYYMMDD=changeDate(Spec.StartDate);
	SpecMath.CorrectOffset(Spec, SOffsetSpec);
    SpecMath.CorrectDarkCurrent(Spec, SDarkSpec);

	Spec = nonlin(Spec);

	Directory.CreateDirectory(OutPath + "\\UV\\" + DateYYYYMMDD);
	if (Spec.Name==""){
		Log=Log + "NULL";
	}
	else{
		if ((Spec.Name.Substring(0,1)=="-")||((Spec.Name.Substring(0,1)>="0")&&(Spec.Name.Substring(0,1)<="9"))){
			Spec.ElevationAngle=Spec.Name;
			Spec.Name=changeDate_file(Spec.StartDate)+' '+Spec.StartTime
			Spec.SaveAs(OutPath + "\\UV\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
			Log=Log + OutPath + "\\UV\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
		}
		else{
			if ((Spec.Name.Substring(0,1)=="o")||(Spec.Name.Substring(0,1)=="O")||(Spec.Name.Substring(0,1)=="d")||(Spec.Name.Substring(0,1)=="D")){
				Directory.CreateDirectory(OutPath + "\\UV-dc_ofs\\" + DateYYYYMMDD);
				Spec.SaveAs(OutPath + "\\UV-dc_ofs\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
				Log=Log + OutPath + "\\UV-dc_ofs\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
			}
			else{
				if ((Spec.Name.Substring(0,1)=="h")||(Spec.Name.Substring(0,1)=="H")){
					Directory.CreateDirectory(OutPath + "\\UV-Hg\\" + DateYYYYMMDD);
					Spec.SaveAs(OutPath + "\\UV-Hg\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
					Log=Log + OutPath + "\\UV-Hg\\" + DateYYYYMMDD + "\\U"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
				}
				else{
					Log=Log + "NULL";
				}
			}
		}
	}
	CurrentDateTime = new Date();
	//Log=CurrentDateTime + "  " + Log;
	if ( Spec.ElevationAngle != '90' ){
		Log=Spec.AzimuthAngle+' '+Spec.ElevationAngle
	//System.Console.WriteLine(Log);
		LogFile.WriteLine(Log);
	//LogFile.WriteLine(myspec.fullName)
	}
// VIS
/* 	Spec = myspec.Open(InPath_V + "\\V" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\V" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7);
	Log= InPath_V + "\\V" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\V" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + " '" + Spec.Name + "' " + trimDate(Spec.StartDate) + " => ";
	//Spec.AzimuthAngle=changeName_new(Spec.Name)
	Spec.AzimuthAngle=Math.round(parseFloat(changeName_new(Spec.Name).split(' ')[2]))
	Spec.Name=changeName(Spec.Name);
	DateYYYYMMDD=changeDate(Spec.StartDate);

	SpecMath.CorrectOffset(Spec, SOffsetSpec_V);
    SpecMath.CorrectDarkCurrent(Spec, SDarkSpec_V);

	Spec = nonlin_V(Spec);
	Directory.CreateDirectory(OutPath + "\\VIS\\" + DateYYYYMMDD);
	if (Spec.Name==""){
		Log=Log + "NULL";
	}
	else{
		if ((Spec.Name.Substring(0,1)=="-")||((Spec.Name.Substring(0,1)>="0")&&(Spec.Name.Substring(0,1)<="9"))){
			Spec.ElevationAngle=Spec.Name;
			Spec.Name=changeDate_file(Spec.StartDate)+' '+Spec.StartTime
			Spec.SaveAs(OutPath + "\\VIS\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
			Log=Log + OutPath + "\\VIS\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
		}
		else{
			if ((Spec.Name.Substring(0,1)=="o")||(Spec.Name.Substring(0,1)=="O")||(Spec.Name.Substring(0,1)=="d")||(Spec.Name.Substring(0,1)=="D")){
				Directory.CreateDirectory(OutPath + "\\VIS-dc_ofs\\" + DateYYYYMMDD);
				Spec.SaveAs(OutPath + "\\VIS-dc_ofs\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
				Log=Log + OutPath + "\\VIS-dc_ofs\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
			}
			else{
				if ((Spec.Name.Substring(0,1)=="h")||(Spec.Name.Substring(0,1)=="H")){
					Directory.CreateDirectory(OutPath + "\\VIS-Hg\\" + DateYYYYMMDD);
					Spec.SaveAs(OutPath + "\\VIS-Hg\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std");
					Log=Log + OutPath + "\\VIS-Hg\\" + DateYYYYMMDD + "\\V"  + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + ".std"  + " '" + Spec.Name +"'";
				}
				else{
					Log=Log + "NULL";
				}
			}
		}
	} */
	//CurrentDateTime = new Date();
	//Log=CurrentDateTime + "  " +Log;
	//System.Console.WriteLine(Log);
	//LogFile.WriteLine(Log);


}

LogFile.Close();

function changeName_new(oldName:String):String{
	var i=0;
	var flag=3; 
	var str ="";
	if (oldName==""){
		return oldName;
	}
	else{
		if ((oldName.Substring(0,1)=="-")||(oldName.Substring(0,1)==".")||((oldName.Substring(0,1)>="0") && (oldName.Substring(0,1)<="9"))){
			while ((i<oldName.length)&&(flag!=0)){
				if ((oldName.Substring(i,1)==" ")){
				    flag=flag-1;
				}
				str=str+oldName.Substring(i,1);
				i++;
			}
			return str;
		}
		else{
			return oldName;
		}
	}
}

function changeName(oldName:String):String{
	var i=0;
	var str ="";
	var x:Number;
	if (oldName==""){
		return oldName;
	}
	else{
		if ((oldName.Substring(0,1)=="-")||(oldName.Substring(0,1)==".")||((oldName.Substring(0,1)>="0") && (oldName.Substring(0,1)<="9"))){
			while ((i<oldName.length)&&(oldName.Substring(i,1)!=" ")){
				str=str+oldName.Substring(i,1);
				i++;
			}
			x=str;
			return x.ToString("f0");
		}
		else{
			return oldName;
		}
	}
}

function changeDate(oldDate:String):String{
	var flag=0;
	var mm="";
	var dd="";
	var yyyy="";
	//month
	mm=oldDate.Substring(0,1);
	if (oldDate.Substring(1,1)=="/"){
		mm="0"+mm;
		flag=2;
	}
	else{
		mm=mm+oldDate.Substring(1,1);
		flag=3;
	}
	//day
	dd=oldDate.Substring(flag,1);
	if (oldDate.Substring(flag+1,1)=="/"){
		dd="0"+dd;
		flag=flag+2;
	}
	else{
		dd=dd+oldDate.Substring(flag+1,1);
		flag=flag+3;
	}
	//year
	yyyy=oldDate.Substring(flag,4);

	return yyyy+mm+dd;
}

function changeDate_file(oldDate:String):String{
	var flag=0;
	var mm="";
	var dd="";
	var yyyy="";
	//month
	mm=oldDate.Substring(0,1);
	if (oldDate.Substring(1,1)=="/"){
		mm="0"+mm;
		flag=2;
	}
	else{
		mm=mm+oldDate.Substring(1,1);
		flag=3;
	}
	//day
	dd=oldDate.Substring(flag,1);
	if (oldDate.Substring(flag+1,1)=="/"){
		dd="0"+dd;
		flag=flag+2;
	}
	else{
		dd=dd+oldDate.Substring(flag+1,1);
		flag=flag+3;
	}
	//year
	yyyy=oldDate.Substring(flag,4);

	return yyyy+"-"+mm+"-"+dd;
}

function trimDate(oldDate:String):String{
	return oldDate.Substring(0,oldDate.length-9);
}
