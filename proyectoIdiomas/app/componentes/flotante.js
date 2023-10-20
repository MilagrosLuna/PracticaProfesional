import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const botones = props => {
  const {parametros} = props;
  const botones = () => {
    const resultados = [];
    parametros.forEach((it, index) => {
      const boton = (
        <TouchableOpacity
          key={index}
          onPress={() => {
            it.onPress;
          }}
          style={styles.boton}>
          <Image source={it.image} style={styles.image} />
          <Text>{it.text} </Text>
        </TouchableOpacity>
      );
      resultados.push(boton);
    });
    return resultados;
  };
  return botones();
};

export default function BotonFlotante(parametros) {
  return (
    <View style={styles.container}>
      <View style={styles.child}>{botones(parametros)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
  container: {
    position: 'absolute',
    bottom: 10,
    height: 65,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  child: {
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    padding: 2,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  boton: {
    height: 50,
    width: 60,
    alignItems: 'center',
  },
  text: {},
});
