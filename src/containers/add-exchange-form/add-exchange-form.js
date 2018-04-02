import { reduxForm } from 'redux-form';
import AddExchangeForm from '../../components/add-exchange-form';

export default reduxForm({
  form: 'addExchange',
})(AddExchangeForm);
