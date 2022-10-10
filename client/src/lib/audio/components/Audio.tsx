import React, {useEffect, useImperativeHandle} from 'react';
import type RNSound from 'react-native-sound';
import useAudio from '../hooks/useAudio';

type AudioProps = {
  source: string;
  paused?: boolean;
  repeat?: boolean;
  volume?: number;
  onLoad?: (sound: RNSound) => void;
};

const Audio = React.forwardRef<RNSound | undefined, AudioProps>(
  ({source, paused = false, repeat = false, volume = 1, onLoad}, ref) => {
    const sound = useAudio(source);

    // Expose sound as ref
    useImperativeHandle(ref, () => sound, [sound]);

    useEffect(() => {
      if (onLoad && sound) {
        onLoad(sound);
      }
    }, [sound, onLoad]);

    useEffect(() => {
      sound?.setNumberOfLoops(repeat ? -1 : 0);
    }, [sound, repeat]);

    useEffect(() => {
      if (paused) {
        sound?.stop();
      } else {
        sound?.play();
      }
    }, [sound, paused]);

    useEffect(() => {
      sound?.setVolume(volume);
    }, [sound, volume]);

    return null;
  },
);

export default Audio;