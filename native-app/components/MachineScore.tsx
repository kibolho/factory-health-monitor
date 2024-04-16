import React from 'react';
import { StyleSheet } from 'react-native';

import { machineNames } from '../data/types';
import { Text } from './Themed';

export const MachineScore = ({
  machineName,
  score,
}: {
  machineName: string;
  score: string;
}) => {
  return (
    <>
      {score && (
        <>
          <Text
            style={styles.text}
          >{`${machineNames[machineName]}: ${score}`}</Text>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {},
});
