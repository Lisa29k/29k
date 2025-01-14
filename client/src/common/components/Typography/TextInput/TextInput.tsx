import {TextInput} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import textStyles from '../styles';

const Input = styled(TextInput)({
  height: 44,
  paddingHorizontal: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.TWELVE,
  ...textStyles.Body16,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: 16,
});

export default Input;
