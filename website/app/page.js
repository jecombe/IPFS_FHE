"use client";
import { createHelia } from 'helia'
import { React, useState, useEffect } from 'react'

const Home = () => {
  const [id, setId] = useState(null)
  const [helia, setHelia] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [file, setFile] = useState(null)

  useEffect(() => {
    const init = async () => {
      if (helia) return

      const heliaNode = await createHelia()

      const nodeId = heliaNode.libp2p.peerId.toString()
      const nodeIsOnline = heliaNode.libp2p.status === 'started'

      setHelia(heliaNode)
      setId(nodeId)
      setIsOnline(nodeIsOnline)
    }

    init()
  }, [helia])

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const fileContent = Buffer.from(reader.result)

      // Utiliser Helia pour envoyer le fichier
      const result = await helia.add(fileContent)

      console.log('file success. CID:', result.cid.toString())
    }
    reader.readAsArrayBuffer(file)
  }

  if (!helia || !id) {
    return <h4>Starting Helia...</h4>
  }

  return (
    <div>
      <h4 data-test="id">ID: {id.toString()}</h4>
      <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Send File</button>
    </div>
  )
}

export default Home
