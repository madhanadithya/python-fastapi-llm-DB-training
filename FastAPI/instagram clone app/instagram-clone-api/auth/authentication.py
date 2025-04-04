# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security.oauth2 import OAuth2PasswordRequestForm
# from pydantic import BaseModel
# from db.database import get_db
# from sqlalchemy.orm.session import Session
# from db.models import DbUser
# from db.hashing import Hash
# from auth.oauth2 import create_access_token, create_refresh_token
# from jose import jwt, JWTError
# from auth.oauth2 import SECRET_KEY, ALGORITHM


# router = APIRouter(
#   tags=['authentication']
# )

# @router.post('/login')
# def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#   user = db.query(DbUser).filter(DbUser.username == request.username).first()
#   if not user:
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#           detail='Invalid credentials')
#   if not Hash.verify(user.password, request.password):
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#           detail='Incorrect password')
  
#   access_token = create_access_token(data={'username': user.username})
#   refresh_token = create_refresh_token(data={'username': user.username})


#   # Store the refresh token in the database
#   user.refresh_token = refresh_token
#   db.commit()
#   db.refresh(user)

#   return {
#     'access_token': access_token,
#     'refresh_token': refresh_token,
#     'token_type': 'bearer',
#     'user_id': user.id,
#     'username': user.username
#   }



# class TokenRequest(BaseModel):
#     refresh_token: str

# @router.post('/refresh')
# def refresh_token(request: TokenRequest, db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(request.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("username")
#         if username is None:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
#         user = db.query(DbUser).filter(DbUser.username == username).first()
#         if not user or user.refresh_token != request.refresh_token:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

#         # Generate new access token
#         new_access_token = create_access_token(data={"username": username})

#         return {"access_token": new_access_token, "token_type": "bearer"}
#     except JWTError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

#-------------------------------------------------------------------------------------------------------



from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from pydantic import BaseModel
from db.database import get_db
from sqlalchemy.orm.session import Session
from db.models import DbUser
from db.hashing import Hash
from auth.oauth2 import create_access_token, create_refresh_token
from jose import jwt, JWTError
from auth.oauth2 import SECRET_KEY, ALGORITHM
from fastapi import Response, Request


router = APIRouter(
  tags=['authentication']
)

@router.post('/login')
def login(response: Response, request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  user = db.query(DbUser).filter(DbUser.username == request.username).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
          detail='Invalid credentials')
  if not Hash.verify(user.password, request.password):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
          detail='Incorrect password')
  
  access_token = create_access_token(data={'username': user.username})
  refresh_token = create_refresh_token(data={'username': user.username})


  # Store the refresh token in the database
  user.refresh_token = refresh_token
  db.commit()
  db.refresh(user)


  response.set_cookie(
      key="refresh_token",
      value=refresh_token,
      httponly=True,  # Prevent JavaScript access
      secure=True,  # Send only over HTTPS
      samesite="Strict",  # Protect against CSRF
      max_age=7 * 24 * 60 * 60  
  )



  return {
    'access_token': access_token,
    'token_type': 'bearer',
    'user_id': user.id,
    'username': user.username
  }


@router.post('/logout')
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}




from fastapi import Request

@router.post('/refresh')
def refresh_token(request: Request, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token found")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        user = db.query(DbUser).filter(DbUser.username == username).first()
        if not user or user.refresh_token != refresh_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        # Generate new access token
        new_access_token = create_access_token(data={"username": username})

        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
