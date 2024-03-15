// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const userSchema = yup.object().shape({
  username:yup.string().trim()
  .required(e.usernameRequired)
  .min(3, e.usernameMin).max(20, e.usernameMax), 
  favLanguage: yup.string()
  .required(e.favLanguageRequired).trim()
  .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup.string()
  .required(e.favFoodRequired).trim().oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: yup.boolean()
  .required(e.agreementRequired).oneOf([true], e.agreementOptions)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  const data = () => ({
    username: '', 
    favLanguage: '', 
    favFood: '',
     agreement: false
  })

  const dataErrors = () => ({
    username: '', 
    favLanguage: '', 
    favFood: '',
     agreement: ''
  })
  const [formData, setFormData] = useState(data())

   const [formErrors, setFormErrors] = useState(dataErrors())
    
  const [messageSuccess, setMessageSuccess] = useState()
  const [messageFaliure, setMessageFaliure] = useState()
  const [isSubmitDisalbled, setIsSubmitDisabled] = useState(false)

  

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  useEffect(() => {
    userSchema.isValid(formData).then(setIsSubmitDisabled)
  }, [formData])


  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {name, value, type, checked} = evt.target
    value = type == 'checkbox'? checked : value
    setFormData({...formData, [name]: value})
    yup.reach(userSchema, name).validate(value)
    .then(() => setFormErrors({...formErrors, [name]: ''}))
    .catch((err) => setFormErrors({...formErrors, [name]: err.errors[0] }))
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post(' https://webapis.bloomtechdev.com/registration', formData)
    .then(res => {
      setFormData(data())
      setMessageSuccess(res.data.message)
      setMessageFaliure()
    })
    .catch(err => {
      setMessageFaliure(err.response.data.message)
      setMessageSuccess()
    })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {messageSuccess && <h4 className="success">{messageSuccess}</h4>}
        {messageFaliure && <h4 className="error">{messageFaliure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={formData.username} onChange={onChange} id="username" name="username" type="text" placeholder="Type Username" />
          {formErrors.username && <div className="validation">{formErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input checked={formData.favLanguage == 'javascript'} onChange={onChange} type="radio" name="favLanguage" value="javascript"  />
              JavaScript
            </label>
            <label>
              <input checked={formData.favLanguage == 'rust'} onChange={onChange}type="radio" name="favLanguage" value="rust"  />
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage && <div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={formData.favFood} onChange={onChange} id="favFood" name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formErrors.favFood && <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input checked={formData.agreement} onChange={onChange} id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
          {formErrors.agreement && <div className="validation">{formErrors.agreement}</div>}
        </div>

        <div>
          <input disabled={!isSubmitDisalbled} type="submit" />
        </div>
      </form>
    </div>
  )
}
