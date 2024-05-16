import './Error.css';

function Error({ error, message }) {
   return (
      <div className='errorDiv'>
         <h1>{error}</h1>
         <h2>{message}</h2>
      </div>
   )
}
export default Error;