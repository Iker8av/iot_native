import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { db, dbFs } from './firebase-config';
import {
  ref,
  onValue,
  push,
  update,
  remove
} from 'firebase/database';
import {firestore} from '@react-native-firebase/firestore';
import {getDocs, onSnapshot, collection, doc } from 'firebase/firestore';


export default function App() {
  const [doorState, setDoorState] = React.useState(false)
  const [temperature, setTemperature] = React.useState(28)
  const [lightState, setLightState] = React.useState(false)
  
  const [newRecord, setNewRecord] = React.useState([])
  const [records, setRecords] = React.useState([])

  React.useEffect(() => {
    (async () => {
      let newData;
      const userDocument = await getDocs(collection(dbFs, "Accesos")).then((querySnapshot)=>{               
                newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));  
                    setRecords([...newData])
            })

      return onValue(ref(db, '/'), querySnapShot => {
        let data = querySnapShot.val() || {};
        setDoorState(Object.values(data.Puerta)[Object.values(data.Puerta).length-1])
        setTemperature(Object.values(data.Temperatura)[Object.values(data.Temperatura).length-1])
        setLightState(Object.values(data.Foco)[Object.values(data.Foco).length-1])
        setRecords([data.Usuario, ...newData])
      });
    })()

    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Bienvenido, Usuario</Text>

      {/* Historial */}

      <View style={styles.bigBlock}>
          <Text style={styles.sub2}>Historial de accesos:</Text>
          <ScrollView 
            contentContainerStyle={{flexGrow: 1}}
            style={styles.scrollView2}
            showsVerticalScrollIndicator={false} >
          {records.length > 0 && records.map((item, i) => {
            return <View key={i}>
                {<Record data={item} i={i}/>}
                {i != records.length - 1 && <View
                  style={{
                    backgroundColor: '#838383',
                    height: 1,
                    width: "100%",
                    marginVertical: 10,
                  }}
                />}
            </View>
              
          })}
          </ScrollView>
      </View>

      {/* Puerta */}
      <View style={styles.block}>
        <Text style={styles.sub1}>Estado de la puerta:</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconContent}>
            <Image
              style={styles.icon}
              source={doorState ? require('./img/puertaAbierta.png') : require('./img/puertaCerrada.png')}
            />
            <Text style={[styles.textStatus, doorState ? styles.red : styles.green]}>
              {doorState ? "Abierta" : "Cerrada"}
            </Text>
          </View>
        </View>
      </View>

      {/* Temperatura */}
      <View style={styles.block}>
        <Text style={styles.sub1}>Temperatura Exterior:</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconContent}>
            <Image
              style={styles.icon}
              source={require('./img/termometer.png')}
            />
            <Text style={[styles.textStatus, temperature > 20 ? (temperature >= 28 ? styles.orange : styles.green) : styles.blue]}>
              {temperature+"°C"}
            </Text>
          </View>
        </View>
      </View>

      {/* Foco */}
      <View style={styles.block}>
        <Text style={styles.sub1}>Foco Exterior:</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconContent}>
            <Image
              style={styles.icon}
              source={lightState ? require('./img/FocoOn.png') : require('./img/FocoOff.png')}
            />
            <Text style={[styles.textStatus, lightState ? styles.red : styles.green]}>
              {lightState ? "Encendido" : "Apagado"}
            </Text>
          </View>
        </View>
      </View>

      
      </ScrollView>
    </SafeAreaView>
  );
}

const Record = ({data, i}) => {
  return (
    <View style={recordStyle.row}>
      <View style={recordStyle.column}>
        <Text style={recordStyle.name}>{data.Nombre}</Text> 
        <Text style={recordStyle.date}>{data.Fecha}</Text> 
      </View>

      <Text style={data.Acceso ? recordStyle.green : recordStyle.red}>{data.Acceso ? "Aceptado" : "Denegado"}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F7FA',
  },
  scrollView: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  scrollView2: {
    maxHeight: 250,
    flexGrow: 1
  },
  title: {
    width: "100%",
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "left",
    marginTop: 15
  },
  block: {
    flexDirection: 'row',
    marginTop: 15,
  },
  sub1: {
    flex: 1,
    color: "#989898",
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  sub2: {
    color: "#989898",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    aspectRatio: 1,
    flex:1,
    backgroundColor: "#fff",
    borderRadius: "20px",
    borderColor: "#838383",
    borderWidth: "0.25px",
  },
  iconContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  textStatus: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bigBlock: {
    backgroundColor: "white",
    padding: 15,
    marginTop: 20,
    borderRadius: "20px",
    borderColor: "#838383",
    borderWidth: "0.25px",
  },
  blue: {
    color: "#00BDE7"
  },
  orange: {
    color: "#E7A600"
  },
  green: {
    color: "green"
  },
  red: {
    color: "red"
  },
});

const recordStyle = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
  row: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#7A7A7A"
  },
  orange: {
    color: "#E7A600",
    fontSize: 20,
    fontWeight: 'bold',
  },
  green: {
    color: "green",
    fontSize: 20,
    fontWeight: 'bold',
  },
  red: {
    color: "red",
    fontSize: 20,
    fontWeight: 'bold',
  },
});