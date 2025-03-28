import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Done from "@mui/icons-material/Done";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/services/ProductData";
import { Footer, NavBaar } from "../../components";
import {
  useAddcartMutation,
  useGetcartQuery,
} from "../../redux/services/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { setcart, setloginForm } from "../../redux/SideBar/sideBarSlice";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Zod validation schema
const schema = z.object({
  color: z.string().nonempty("Color is required"),
  size: z.string().nonempty("Size is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});


const ProductExample = () => {
  // const isLogin = sessionStorage.getItem('UserLogin');
  const { userLogins } = useSelector(
    (state) => state.sideBar
  )
    console.log(userLogins)
  const [mainImage, setMainImage] = useState("");

  const userId = localStorage.getItem("UserId");

  const { id } = useParams();

  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  console.log(data)
  // const { data: carts, refetch } = useGetcartQuery(userId);
  const [addcart, { data: addItem, error: err, isSuccess: succ }] =
    useAddcartMutation();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // console.log(data);
  const stars = data?.stars;

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

 

  useEffect(() => {
    if (data?.imageURL && data.imageURL.length > 0) {
      setMainImage(data.imageURL[0]);
    }
  }, [data]);
  useEffect(() => {
    if (succ) {
      // If item is successfully added to cart, call setcart()
      dispatch(setcart());
    }
  }, [succ, dispatch]);

  const sizes = data?.size.map((pro) => pro.value);
  // console.log(sizes)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product data.</div>;
  }

  const onSubmit  = async (formData) => {
    
    const submissionData = {
      ...formData,
      userId: userId,
      productId: id,
      name: data?.name,
      imageURL: data?.imageURL[0],
      newPrice: data?.newPrice,
    };
    if(userLogins){
      await addcart(submissionData);
    }else{
      dispatch(setloginForm());
      setTimeout(() => {
        toast.warn('You need to login first', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, 100);
      
     
    }
    
  };

  function isColorDark(color) {
    // Convert hex color to RGB
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 140;
  }

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  return (
    <>
    <ToastContainer />
      <NavBaar />
      <Box sx={{ maxWidth: "6xl", mx: "auto", py: 16, px: 6 }}>
        <Grid container spacing={6} sx={{ justifyContent: "center" }}>
          <Grid item md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <img
                alt="Main Product Image"
                src={mainImage}
                style={{
                  width: "100%",
                  height: "550px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <Grid container spacing={2}>
                {data?.imageURL?.map(
                  (imageSrc, index) =>
                    imageSrc && (
                      <Grid item xs={3} key={index}>
                        <div
                          style={{
                            width: "100%",
                            height: "150px", // Fixed height
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            overflow: "hidden", // Ensures the image does not overflow the container
                            cursor: "pointer",
                            display: "flex", // Centering image container
                            alignItems: "center", // Centering image vertically
                            justifyContent: "center", // Centering image horizontally
                          }}
                          onClick={() => handleImageClick(imageSrc)}
                        >
                          <img
                            alt={`Secondary Product Image ${index + 1}`}
                            src={imageSrc}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover", // Ensures the image covers the container without distorting
                            }}
                          />
                        </div>
                      </Grid>
                    )
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography variant="h3" fontWeight="bold">
                  {data?.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      className={`w-5 h-5 ${
                        index < stars
                          ? "fill-yellow-500"
                          : "fill-muted stroke-muted-foreground"
                      }`}
                    />
                  ))}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 1 }}
                  >
                    ({stars})
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ my: 2 }}>
                  {data?.newPrice} MAD
                </Typography>
              </Grid>

              <form onSubmit={handleSubmit(onSubmit)} className="ml-14">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormLabel
            id="product-color-attribute"
            sx={{
              mb: 1.5,
              fontWeight: "xl",
              textTransform: "uppercase",
              fontSize: "xs",
              letterSpacing: "0.1em",
            }}
          >
            Color
          </FormLabel>
          <Controller
            name="color"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby="product-color-attribute"
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                  handleColorChange(event);
                }}
                sx={{ gap: 2, flexWrap: "wrap", flexDirection: "row" }}
              >
                {data?.color.map((color) => (
                  <Sheet
                    key={color}
                    sx={{
                      position: "relative",
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      backgroundColor: color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Radio
                      overlay
                      variant="solid"
                      color={color}
                      checkedIcon={
                        <Done
                          fontSize="xl2"
                          sx={{
                            color: isColorDark(color) ? "white" : "black",
                          }}
                        />
                      }
                      value={color}
                      slotProps={{
                        input: { "aria-label": color },
                        radio: {
                          sx: {
                            display: "contents",
                            "--variant-borderWidth": "2px",
                          },
                        },
                      }}
                      sx={{
                        "--joy-focus-outlineOffset": "4px",
                        "--joy-palette-focusVisible": (theme) =>
                          theme.vars.palette[color],
                        [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                          {
                            outlineWidth: "2px",
                          },
                      }}
                    />
                  </Sheet>
                ))}
              </RadioGroup>
            )}
          />
          {errors.color && <span>{errors.color.message}</span>}
        </Grid>
        <Grid item xs={12}>
          <FormLabel
            id="product-size-attribute"
            sx={{
              mb: 1.5,
              fontWeight: "xl",
              textTransform: "uppercase",
              fontSize: "xs",
              letterSpacing: "0.1em",
            }}
          >
            Size
          </FormLabel>
          <Controller
            name="size"
            control={control}
            defaultValue="M"
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby="product-size-attribute"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                sx={{
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                {sizes?.map((size) => (
                  <Sheet
                    key={size}
                    sx={{
                      position: "relative",
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "--joy-focus-outlineOffset": "4px",
                      "--joy-palette-focusVisible": (theme) =>
                        theme.vars.palette.neutral.outlinedBorder,
                      [`& .${radioClasses.checked}`]: {
                        [`& .${radioClasses.label}`]: {
                          fontWeight: "lg",
                        },
                        [`& .${radioClasses.action}`]: {
                          "--variant-borderWidth": "2px",
                          borderColor: "text.secondary",
                        },
                      },
                      [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                        {
                          outlineWidth: "2px",
                        },
                    }}
                  >
                    <Radio
                      color="neutral"
                      overlay
                      disableIcon
                      value={size}
                      label={size}
                    />
                  </Sheet>
                ))}
              </RadioGroup>
            )}
          />
          {errors.size && <span>{errors.size.message}</span>}
        </Grid>
        <Grid item xs={12}>
          <div className="grid gap-2">
            <label className="text-base" htmlFor="quantity">
              Quantity
            </label>
            <Controller
              name="quantity"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-24 border rounded-md p-2"
                  id="quantity"
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                >
                  {[...Array(data?.productQuantity).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.quantity && <span>{errors.quantity.message}</span>}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mr-16 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
          >
            Add to cart
          </Button>
        </Grid>
      </Grid>
    </form>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 12 }}>
          <Box sx={{ mb: 4 }}>
           {data?.description[0] &&  <Typography variant="h4" fontWeight="bold">
              Product Details
            </Typography>}
            <Typography variant="body1" color="textSecondary">
              {data?.description[0]}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
              {data?.description[1]}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
              {data?.description[2]}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Customer Reviews
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Avatar
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFXJUrnnjc_i_f_k6ZdCqfTqfxOU3mnkz1gA&s"
                    alt="Sarah Johnson"
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Sarah Johnson
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", my: 2 }}
                      >
                        {Array.from({ length: 5 }, (_, index) => (
                          <StarIcon
                            key={index}
                            className={`w-5 h-5 ${
                              index < stars
                                ? "fill-yellow-500"
                                : "fill-muted stroke-muted-foreground"
                            }`}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      I've been using the Acme Leather Backpack for a few weeks
                      now and I'm really impressed with the quality and
                      functionality. The leather is durable and the design is
                      both stylish and practical. Highly recommend!
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Avatar
                    src="https://img.freepik.com/photos-premium/illustration-homme-barbu_665280-67047.jpg"
                    alt="Alex Smith"
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Alex Smith
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", my: 2 }}
                      >
                        {Array.from({ length: 5 }, (_, index) => (
                          <StarIcon
                            key={index}
                            className={`w-5 h-5 ${
                              index < stars
                                ? "fill-yellow-500"
                                : "fill-muted stroke-muted-foreground"
                            }`}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      I absolutely love this backpack! The quality is top-notch
                      and it's been a great companion for my daily commute and
                      weekend adventures. The spacious main compartment and
                      various pockets make it easy to stay organized. Highly
                      recommend!
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default ProductExample;
