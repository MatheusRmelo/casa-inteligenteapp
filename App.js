/* Importações do react e componentes, e importação do Axios para fazer as requisições */
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import axios from "axios"

/* Criação do componente principal */
export default function App() {
  /* Definindo os estados/variáveis para mexer com os estados dos sensores */
  const [sensorPiscina, setSensorPiscina] = useState()
  const [sensorAlarme, setSensorAlarme] = useState()
  const [sensorSala, setSensorSala] = useState()

  /* Utilização do useEffect para fazer a requisição no banco e verificar os estados dos sensores */
  useEffect(() => {
    axios
      /* Definição da url que será feita a requisição */
      .get("https://mptein.000webhostapp.com/todos_sensores.php")
      /* Tratando a resposta da requisição */
      .then(function (response) {
        /* Atribuindo os valores do banco de dados aos estados */
        JSON.stringify(response.data[0].sensor1 == 1 ? setSensorPiscina(-3) : setSensorPiscina(23))
        JSON.stringify(response.data[1].sensor2 == 1 ? setSensorAlarme(-3) : setSensorAlarme(23))
        JSON.stringify(response.data[2].sensor3 == 1 ? setSensorSala(-3) : setSensorSala(23))
      })
      /* Tratamento de erros */
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  /* Função para atualizar os valores no banco de dados */
  function updateValues(sensorCode, sensorStatus) {
    /* Utilização do Axios para atualizar os valores no banco */
    axios.get(`https://mptein.000webhostapp.com/update.php?SensorCode=${sensorCode}&SensorStatus=${sensorStatus}`)
  }

  /* Função para lidar com o switch */
  function handleSwitch(code) {
    /* Estrutura lógica de decisão para verificar qual switch está sendo ativado ou desligado */
    switch (code) {
      /* Se for o switch 1 */
      case 1:
        /* Se o valor do sensor piscina for igual a 23 (23 = valor da posição do botão do switch [23 = off, -3 = on]) */
        if (sensorPiscina === 23) {
          /* Setando o valor de piscina para on e mudando o botão do switch para on */
          setSensorPiscina(-3)
          /* chamando a função de atualizar os valores do banco de dados, passando o parâmetro code (código do sensor) e 'on' (estado do sensor) */
          updateValues(code, 'on')
          return
        }
        /* Caso o valor do sensor piscina for diferente de 23, seta o estado do sensorPiscina para 23 (desligado)*/
        setSensorPiscina(23)
        /* chamando a função de atualizar os valores do banco de dados, passando o parâmetro code (código do sensor) e 'off' (estado do sensor) */
        updateValues(code, 'off')
        break;
      case 2:
        if (sensorAlarme === 23) {
          setSensorAlarme(-3)
          updateValues(code, 'on')
          return
        }
        setSensorAlarme(23)
        updateValues(code, 'off')
        break;
      case 3:
        if (sensorSala === 23) {
          setSensorSala(-3)
          updateValues(code, 'on')
          return
        }
        setSensorSala(23)
        updateValues(code, 'off')
        break;
      default:
        break;
    }
  }

  /* Se os valores dos sensores já estiverem definidos renderiza a tela principal*/
  if (sensorPiscina && sensorAlarme && sensorSala) {
    return (
      <View style={styles.container}>
        {/* Logo */}
        <Image
          style={styles.logo}
          source={require("./assets/home-icon.png")}
        />
        {/* Container dos switchs */}
        <View>
          <Text style={styles.title}>Painel de Controle</Text>

          {/* Switch Piscina */}
          <View style={styles.switchBox}>
            <Text style={styles.switchTitle}>Piscina</Text>
            <TouchableWithoutFeedback onPress={() => handleSwitch(1)}>
              <View style={styles.switch}>
                <Text style={styles.status}>Off</Text>
                <Text style={styles.status}>On</Text>
                <View style={[styles.switchBall, {transform: [{ translateY: sensorPiscina }]}]}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Switch Alarme */}
          <View style={styles.switchBox}>
            <Text style={styles.switchTitle}>Alarme</Text>
            <TouchableWithoutFeedback onPress={() => handleSwitch(2)}>
              <View style={styles.switch}>
                <Text style={styles.status}>Off</Text>
                <Text style={styles.status}>On</Text>
                <View style={[styles.switchBall, {transform: [{ translateY: sensorAlarme }]}]}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Switch Sala */}
          <View style={styles.switchBox}>
            <Text style={styles.switchTitle}>Sala</Text>
            <TouchableWithoutFeedback onPress={() => handleSwitch(3)}>
              <View style={styles.switch}>
                <Text style={styles.status}>Off</Text>
                <Text style={styles.status}>On</Text>
                <View style={[styles.switchBall, {transform: [{ translateY: sensorSala }]}]}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Configuração da barra de notificações */}
        <StatusBar translucent={false} backgroundColor={'#f3f6ff'}/>
      </View>
    );
    /* Caso os valores dos sensores ainda não estiverem definidos, retorne um componente de loading */
  } else {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }
}

/* Estilos */
const styles = StyleSheet.create({
  loading: {
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f6ff",
    paddingHorizontal: 25,
  },
  logo: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginVertical: 40
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  switchBox: {
    backgroundColor: "#0366c2",
    width: "100%",
    height: 70,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20
  },
  switchTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  switch: {
    backgroundColor: "#1652a1",
    width: 52,
    height: 57,
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  status: {
    color: "#fff",
  },
  switchBall: {
    backgroundColor: "#fff",
    width: 46,
    height: 28,
    marginBottom: 2,
    borderRadius: 10,
    position: "absolute",
    
  },
});
