import styled from 'styled-components'
import { FaSpinner } from 'react-icons/fa'

export default styled(FaSpinner) `
@-webkit-keyframes spin {
  from { -webkit-transform: rotate(0deg); }
  to { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
animation-name: spin;
animation-duration: 5000ms;
animation-iteration-count: infinite;
animation-timing-function: linear;
width: 4em;
height: 4em;
`