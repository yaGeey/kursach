function Search() {

   function handleOnChange(e) {
      console.log(e.target.value)
   }

   return (
      <div className="hSearch">
         <input type='text' onChange={handleOnChange} placeholder='Знайдіть тендер'/>
         <button className="dropbtn">Пошук</button>
         <div className="dropdown">
            <button className="dropbtn">Сортувати &darr;</button>
         </div>
      </div>
   )
}

export default Search;