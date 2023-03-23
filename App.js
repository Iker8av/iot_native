import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [doorState, setDoorState] = React.useState(false)
  const [temperature, setTemperature] = React.useState(28)
  const [lightState, setLightState] = React.useState(false)
  
  const [record, setRecord] = React.useState(["i", "1", "i", "1", "i"])
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
          {record.map((item, i) => {
            return <View >
                {Record(i)}
                {i != record.length - 1 && <View
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
              source={doorState ? require('./img/puertaCerrada.png') : require('./img/puertaAbierta.png')}
            />
            <Text style={[styles.textStatus, doorState ? styles.green : styles.red]}>
              {doorState ? "Cerrada" : "Abierta"}
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
              source={lightState ? require('./img/FocoOff.png') : require('./img/FocoOn.png')}
            />
            <Text style={[styles.textStatus, lightState ? styles.green : styles.red]}>
              {lightState ? "Apagado" : "Encendido"}
            </Text>
          </View>
        </View>
      </View>

      
      </ScrollView>
    </SafeAreaView>
  );
}

const Record = ({i}) => {
  return (
    <View style={recordStyle.row}>
      <View style={recordStyle.column}>
        <Text style={recordStyle.name}>Nombre Apellido</Text> 
        <Text style={recordStyle.date}>22 / Marzo 2023 - 11:28 a.m.</Text> 
      </View>

      <Text style={recordStyle.red}>Salida</Text> 
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
  },
  scrollView2: {
    height: 250,
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