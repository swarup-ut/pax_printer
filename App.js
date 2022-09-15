/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import EscPosPrinter, { getPrinterSeriesByName } from 'react-native-esc-pos-printer';
import successPng from './success.png'

const Section = ({ children, title }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

async function testPrint() {
  try {
    const printers = await EscPosPrinter.discover()

    const printer = printers[0]

    await EscPosPrinter.init({
      target: printer.target,
      seriesName: getPrinterSeriesByName(printer.name),
      language: 'EPOS2_LANG_EN',
    })

    const printing = new EscPosPrinter.printing();

    const printStatus = await printing
      .initialize()
      .align('center')
      .size(3, 3)
      .line('DUDE!')
      .smooth()
      .line('DUDE!')
      .smooth()
      .size(1, 1)
      .text('is that a ')
      .bold()
      .underline()
      .text('printer?')
      .bold()
      .underline()
      .newline(2)
      .align('center')
      .image(successPng, 200)
      .barcode({
        value: 'Test123',
        type: 'EPOS2_BARCODE_CODE93',
        hri: 'EPOS2_HRI_BELOW',
        width: 2,
        height: 50,
      })
      .qrcode({
        value: 'Test123',
        level: 'EPOS2_LEVEL_M',
        width: 5,
      })
      .cut()
      .addPulse()
      .send()

    console.log('Success:', printStatus)

  } catch (e) {
    console.log('Error:', printStatus)
  }
}

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function onPrintBtnPress() {

    console.log('onPrintBtnPress')
    testPrint()

  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button title='print' onPress={onPrintBtnPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
