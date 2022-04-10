//import System; // use the System libary of the .NET framework
//import DoasCore; // use the DoasCore library
//import DoasCore.Device; // use the Device namespace
import DoasCore.IO; // use the Input-/Output namespace
//import DoasCore.Script; // use the Script namespace
import DoasCore.Spectra; // use the Spectra namespace
//import System.IO;

//****Just modify the following 5 lines****
var InPath_U = "E:\\data\\SUST_Campaign_2019_sky01027\\spectra\\UV"; /////////////////////////////////////////////////////////////////////////////////////////////////////
//var InPath_V= "E:\\13016\\13016\\Daily Work\\2017\\Sky01002vsEnvimes003\\Sky01002\\spec\\VIS
var OutPath_U = "C:\\Auto_max_doas_v1\\search_for_the_spectrum"
var iFirstSpectrum = string_character_start_spectrum;
var iLastSpectrum  = string_character_stop_spectrum;
var LogFileName="Convert_Log_sky01155_U.txt";
//****
var myspec = new SpectrumFile();
var Spec: ISpectrum;
var FileNumber;
var digit1, digit2, digit3, digit4, digit5, digit6, digit7;
var LogFile;
var Log;
var dispFileSystem = new ActiveXObject("Scripting.FileSystemObject");
var elev_info = ""
var specdate = ""

if (dispFileSystem.FileExists(OutPath_U + "\\" + LogFileName)){
	LogFile = dispFileSystem.GetFile(OutPath_U + "\\" + LogFileName)
	LogFile.Delete();
}

LogFile = dispFileSystem.OpenTextFile(OutPath_U + "\\" + LogFileName,8,true);

for (FileNumber=iFirstSpectrum;FileNumber<=iLastSpectrum;FileNumber++){
	digit1=int(FileNumber/1000000);
	digit2=int(FileNumber/100000)-digit1*10;
	digit3=int(FileNumber/10000)-int(FileNumber/100000)*10;
	digit4=int(FileNumber/1000)-int(FileNumber/10000)*10;
	digit5=int(FileNumber/100)-int(FileNumber/1000)*10;
	digit6=int(FileNumber/10)-int(FileNumber/100)*10;
	digit7=FileNumber-int(FileNumber/10)*10;
	
	if (dispFileSystem.FileExists(InPath_U + "\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7)){
		
		Spec = myspec.Open(InPath_U + "\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + "00\\U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7);

		if ((Spec.Name.Substring(0,1)=="-")||((Spec.Name.Substring(0,1)>="0")&&(Spec.Name.Substring(0,1)<="9"))){
			elev_info=changeName(Spec.Name);
			specdate=changeDate(Spec.StartDate);
			Log="U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + " " + elev_info + " " +specdate;
		}
		else{
			Log="U" + digit1 + digit2 + digit3 + digit4 + digit5 + digit6 + digit7 + " 90 90 90 20000101";
		}
		LogFile.WriteLine(Log);
	}
}
LogFile.Close();

function changeName(oldName:String):String{
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
