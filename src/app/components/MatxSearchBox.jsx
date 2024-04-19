import { Icon, IconButton, styled } from "@mui/material";
import { Fragment, useState } from "react";
import Loading from "./MatxLoading";


// STYLED COMPONENTS
const SearchContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 9,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "auto",
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  position: 'relative',
  border: "none",
  outline: "none",
  fontSize: "1.2rem",
  borderBottom: '1px solid #E0E0E0',
  height: '64px',
  paddingLeft: "20px",
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  "&::placeholder": { color: theme.palette.text.primary }
}));

const SuggestionsDropdown = styled("div")(({ theme }) => ({
  width: "100%",
  maxHeight: "300px",
  overflowY: "auto",
  borderBottom: '1px solid #E0E0E0'
}));

const SuggestionItem = styled("div")(({ theme }) => ({
  padding: "10px",
  cursor: "pointer",
  "&:hover": {
    background: theme.palette.primary.light,
  }
}));

export default function MatxSearchBox() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState();
  const [loading, setLoading] = useState(false);

  const toggle = () => setOpen(!open);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://ftai-api.monoinfinity.net/api/product/search-sku/${value}`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.statusCode === 200) {
          const filteredSuggestions = [];
          responseData.data.forEach(product => {
            const { name, defaultImage, productVariants } = product;
            const filteredVariants = productVariants.filter(variant => variant.sku.toLowerCase().includes(value.toLowerCase()));
            if (filteredVariants.length > 0) {
              filteredVariants.forEach(variant => {
                filteredSuggestions.push({
                  name: name,
                  defaultImage: defaultImage,
                  ...variant
                });
              });
            }
          });
          // console.log(filteredSuggestions)
          setSuggestions(filteredSuggestions);
        } else {
          console.error('Failed to fetch data:', responseData.message);
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSuggestionClick = (suggestion) => {
    setSearchValue([]);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <Fragment>
      {!open && (
        <IconButton onClick={toggle}>
          <Icon sx={{ color: "text.primary" }}>search</Icon>
        </IconButton>
      )}

      {open && (
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search SKU product..."
            autoFocus
            value={searchValue}
            onChange={handleInputChange}
          />
          <IconButton sx={{ position: 'absolute', right: 10, top: 10 }} onClick={toggle}>
            <Icon sx={{ color: "text.primary" }}>close</Icon>
          </IconButton>
          {loading && <div>
            <Loading />
          </div>}

          <SuggestionsDropdown>
            {suggestions?.map((suggestion, index) => (

              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick()}
              >
                <div style={{ display: 'flex', flexDirection: 'row', borderRadius: '10px', border: '1px solid #E0E0E0', padding: '10px' }}>
                  <div>
                    <img width={100} height={100} src={suggestion.defaultImage} alt="hinh anh" />
                  </div>
                  <div style={{ paddingLeft: '10px', fontFamily: 'Poppins', fontWeight: '600' }}>
                    <div>Name: {suggestion.name}</div>
                    <div>SKU: {suggestion.sku}</div>
                    <div>Quantity: {suggestion.quantity} </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>Color: {suggestion.color.name} <div style={{ height: '20px', width: '20px', backgroundColor: `${suggestion.color.colorCode}`, borderRadius: '50px' }}></div></div>
                    <div>Size: {suggestion.size.value}</div>
                  </div>
                </div>
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        </SearchContainer>
      )}
    </Fragment>
  );
}
