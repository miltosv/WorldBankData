import pandas as pd
import csv
import os, glob

def compine(path, desPath, filename):
    all_files=glob.glob(path + "\\*.csv")
    dir=[]

    for f in all_files:
        df = pd.read_csv(f, index_col=None, header=0)
        dir.append(df)

    dfs= pd.concat(dir, ignore_index=False, sort=None)
    dfs.to_csv(os.path.join(desPath, filename),index=False)

def sortCSV():
    sourceDirectory = "C:\\Users\\stell\\Desktop\\DataV\\SourceData\\notsorted"
    destDir="C:\\Users\\stell\\Desktop\\DataV\\SourceData"
    for filename in os.listdir(sourceDirectory):
        if filename.endswith(".csv"):
            ##print(os.path.join(sourceDirectory,filename))
            data= pd.read_csv(os.path.join(sourceDirectory,filename),header=2,index_col=False)
            data.sort_values(by=["Indicator Code"],ascending=True,inplace=True)
            data.to_csv(os.path.join(destDir,filename),index=False)
           ## print(data.head())

def main():
    sortCSV()
    columnList=list(range(0, 64))
    delta= 2
    rowsneeded=[595,590,567,1216,1218,694,685,678,677,228,1285]
    for i in range(len(rowsneeded)):
       rowsneeded[i]=rowsneeded[i]-delta
    sourceDirectory = "C:\\Users\\stell\\Desktop\\DataV\\SourceData"
    destDirectory = "C:\\Users\\stell\\Desktop\\DataV\\DestData"
    for filename in os.listdir(sourceDirectory):
        if filename.endswith(".csv"):
            #print(os.path.join(sourceDirectory,filename))
            data= pd.read_csv(os.path.join(sourceDirectory,filename),index_col=False,usecols=columnList)
            #print(data.head())
            rowsToWrite=data.iloc[rowsneeded]
            splitname=filename.split('_')
            outputFileName=splitname[1]+".csv"
            rowsToWrite.to_csv(os.path.join(destDirectory,outputFileName),index=False)
            #print(os.path.join(destDirectory,outputFileName))


main()

def getCountryTable():

    directory = "C:\\Users\\stell\\Desktop\\DataV\\DestData"
    DestDirectory= "C:\\Users\\stell\\Desktop\\DataV\\DestData\\Countries"
    columnList=["Country Name","Country Code"]   
    
    for filename in os.listdir(directory):       
        if filename.endswith(".csv"):
            #print(os.path.join(directory,filename))
            rdr=pd.read_csv(os.path.join(directory,filename),usecols=columnList)
            rdr.to_csv(os.path.join(DestDirectory,filename),index=False)
            #print(os.path.join(DestDirectory,filename))

    compine(DestDirectory,DestDirectory,"COUNTRIES.csv")

getCountryTable()

def getIndicatorTable():
    
    columnList=["Indicator Name","Indicator Code"]
    rdr=pd.read_csv("C:\\Users\\stell\\Desktop\\DataV\\DestData\\GRC.csv",usecols=columnList)
    rdr.to_csv("C:\\Users\\stell\\Desktop\\DataV\\INDICATORS.csv",index=False)

getIndicatorTable()

def stackCSV():
    columnList=[1]+list(range(3,64))
    sourceDirectory = "C:\\Users\\stell\\Desktop\\DataV\\DestData"
    destDirectory = "C:\\Users\\stell\\Desktop\\DataV\\DestData\\noname"
    for filename in os.listdir(sourceDirectory):
        if filename.endswith(".csv"):
            data= pd.read_csv(os.path.join(sourceDirectory,filename),index_col=False,usecols=columnList)
            data.to_csv(os.path.join(destDirectory,filename),index=False)


stackCSV()  


def Measurement():

    sourceDirectory = "C:\\Users\\stell\\Desktop\\DataV\\DestData\\noname"
    desDirectory="C:\\Users\\stell\\Desktop\\DataV\\DestData\\allNoname"
    
    compine(sourceDirectory,desDirectory,"all.csv")

    with open("C:\\Users\\stell\\Desktop\\DataV\\DestData\\allNoname\\all.csv",'r+') as infile:
        with open("C:\\Users\\stell\\Desktop\\DataV\\DestData\\mes\\measurements.csv",'w+') as outfile:
            header=["Country Code","Indicator Code","Year","Measurement"]
            writer=csv.writer(outfile)
            writer.writerow(header)
            #listline=[line.split() for line in infile]
            reader=csv.reader(infile)
            listlines=list(reader)
            for i in range(1,len(listlines)):
                for j in range(2,len(listlines[i])):
                    writer.writerow([listlines[i][0],listlines[i][1],listlines[0][j],listlines[i][j]])
            outfile.close()
        infile.close()

Measurement()