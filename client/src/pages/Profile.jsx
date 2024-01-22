import { useDispatch, useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { TbCameraPlus } from "react-icons/tb";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice"

export default function Profile() {
    const fileRef = useRef(null)
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [file, setFile] = useState(undefined)
    const [filePercentage, setFilePercentage] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const dispatch = useDispatch()

    // firebase storage:
    // allow read;
    //   allow write: if
    //   request.resource.size < 2 * 1024 * 1024 &&
    //   request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setFilePercentage(Math.round(progress))
        },
            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL })
                })
            })
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message))
                return
            }
            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                <div className="relative self-center">
                    <img src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2" onClick={() => fileRef.current.click()} />
                    <TbCameraPlus className="absolute bottom-0 right-0 w-6 h-6 text-gray-600 bg-white cursor-pointer rounded-lg" onClick={() => fileRef.current.click()} />
                </div>
                <p className="text-center">
                    {fileUploadError ?
                        (<span className="text-red-600">Image upload failed! (Image must be less than 2MB)</span>) :
                        filePercentage > 0 && filePercentage < 100 ?
                            (<span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>) :
                            filePercentage === 100 ?
                                (<span className="text-green-600">Image is uploaded successfully!</span>) : ""
                    }
                </p>
                <input type="text" placeholder="Username" className="border p-3 rounded-lg" id="username" defaultValue={currentUser.username} onChange={handleChange} />
                <input type="email" placeholder="Email" className="border p-3 rounded-lg" id="email" defaultValue={currentUser.email} onChange={handleChange} />
                <input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" />
                <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80">
                    {loading ? 'Loading...' : "Update"}
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer hover:underline" onClick={handleDeleteUser}>Delete account</span>
                <span className="text-red-700 cursor-pointer hover:underline">Sign out</span>
            </div>
            <p className="text-red-600 mt-5">{error ? error : ""}</p>
            <p className="text-green-600 mt-5">{updateSuccess ? "User is updated succussfully!" : ""}</p>
        </div>
    )
}
