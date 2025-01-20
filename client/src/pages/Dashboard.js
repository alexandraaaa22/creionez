import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import MDEditor from '@uiw/react-md-editor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTags, faPaperclip, faShareAlt } from '@fortawesome/free-solid-svg-icons';

import { getAllMaterii, createMaterie, createNotita, getAllNotite, deleteNotita, updateNotita } from '../api/protected';

import axios from 'axios';

const Dashboard = () => {
    console.log('Dashboard rendered');

    const navigate = useNavigate();
    const [user, setUser] = useState({ nume: '', prenume: '' });

    // materie si materii
    const [materii, setMaterii] = useState([]);
    const [showAddMaterie, setShowAddMaterie] = useState(false);
    const [newMaterie, setNewMaterie] = useState('');

    // notite
    const [visibleNotitaMaterie, setVisibleNotitaMaterie] = useState(null);
    const [notitaContent, setNotitaContent] = useState('');
    const [notite, setNotite] = useState({});

    const [editingNotita, setEditingNotita] = useState(null);

    const MarkdownEditor = React.memo(({ notitaContent, setNotitaContent }) => {
      return (
          <div style={{ marginBottom: '20px' }}>
              <MDEditor
                  value={notitaContent}
                  onChange={setNotitaContent} // Updates the state with markdown content
                  style={{ width: '100%' }}
              />
          </div>
      );
    });

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5005/student', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user details:', err);
            alert('Session might be expired. Please log in again and retry.');
            localStorage.removeItem('token');
            navigate('/auth');
        }
    };


    const fetchMaterii = async () => {
        try {
            const data = await getAllMaterii();

            if (data.data.length === 0) {
                alert('No materii found. Please add a materie.');
                return;
            }

            setMaterii(data.data);
            fetchAllNotite(data.data);
        } catch (err) {
            console.error('Error fetching materii:', err);
            alert('Session might be expired. Please log in again and retry.');
            localStorage.removeItem('token');
            navigate('/auth');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const handleAddMaterie = async () => {
      if (!newMaterie.trim()) {
          alert('Adauga un nume valid de materie.');
          return;
      }

      try {
          const data = await createMaterie({ nume_materie: newMaterie.trim() });
          setMaterii([...materii, data.materie]); // Append the newly created materie to the list
          console.log("Materii actualizate:", [...materii, data.materie]);
          setNewMaterie(''); // Clear the input field
          alert('Materie added successfully!');
      } catch (err) {
          if (err.response?.status === 409) {
              alert('Materie already exists for this student.');
          } else {
              console.error('Error adding materie:', err);
              alert('Failed to add materie. Please try again.');
          }
      }
    };

    const handleAddNotita = async (materieId) => {
      if (!notitaContent.trim()) {
          alert('Please enter a valid notita.');
          return;
      }

      try {
        const payload = {
          ID_materie: materieId, // Ensure number
          notita: notitaContent.trim(),
        };

        console.log('Payload Sent to API:', payload);

        const response = await createNotita(payload);

        console.log('Notita Added:', response);
        alert('Notita added successfully!');
        setNotitaContent('');
        setVisibleNotitaMaterie(null);
      } catch (err) {
          console.error('Error adding notita:', err.response?.data || err.message);
          alert(err.response?.data?.error || 'Failed to add notita. Please try again.');
      }
    };

    const handleEditNotita = (notita) => {
        console.log('Editing notita:', notita);
        setEditingNotita(notita); // State to track which notita is being edited
        setNotitaContent(notita.notita); // Pre-fill the markdown editor with the existing content
    };

    const handleContentChange = useCallback((content) => {
        setNotitaContent(content);
      }, [setNotitaContent]
    );

    // Save edited notita back to the database
    const handleSaveNotita = async () => {
        if (!notitaContent.trim()) {
            alert('Please enter valid content.');
            return;
        }

        try {
            await updateNotita(editingNotita.id, notitaContent.trim()); // Update notita in the database

            // Update state locally
            setNotite((prev) => {
                const updatedNotite = { ...prev };
                for (const materieId in updatedNotite) {
                    updatedNotite[materieId] = updatedNotite[materieId].map((notita) =>
                        notita.id === editingNotita.id
                            ? { ...notita, notita: notitaContent.trim() }
                            : notita
                    );
                }
                return updatedNotite;
            });

            alert('Notita updated successfully!');
            setEditingNotita(null); // Exit edit mode
            setNotitaContent(''); // Clear editor content
        } catch (err) {
            console.error('Error saving notita:', err);
            alert('Failed to save notita. Please try again.');
        }
    };

    const handleDeleteNotita = async (notitaId) => {
        try {
            await deleteNotita(notitaId); // Call the helper function

            // Update state to remove the deleted notita
            setNotite((prev) => {
                const updatedNotite = { ...prev };
                for (const materieId in updatedNotite) {
                    updatedNotite[materieId] = updatedNotite[materieId].filter(
                        (notita) => notita.id !== notitaId
                    );
                }
                return updatedNotite;
            });

            alert('Notita deleted successfully!');
        } catch (err) {
            console.error('Error deleting notita:', err);
            alert('Failed to delete notita. Please try again.');
        }
    };

    const handleAddAttachment = (notita) => {
        console.log('Adding attachment for notita:', notita);
        alert(`Attachment feature for Notita ID: ${notita.id} in curand!`);
    };

    const handleAddTags = (notita) => {
        console.log('Adding tags for notita:', notita);
        alert(`Tag feature for Notita ID: ${notita.id} in curand!`);
    };

    const handleShareNotita = (notita) => {
        console.log('Sharing notita:', notita);
        alert(`Share feature for Notita ID: ${notita.id} in curand!`);
    };

    const handleCreateGroup = () => {
        console.log('Creaza grup de studiu');
        alert(`Creare grup de studiu in curand!`);
    };

    const fetchNotiteForMaterie = async (materieId) => {
        try {
            const data = await getAllNotite(materieId);
            setNotite((prev) => ({ ...prev, [materieId]: data.data })); // Assuming `data` contains the array of notite
        } catch (err) {
            console.error('Error fetching notite:', err);
            alert('Failed to fetch notite. Please try again.');
        }
    };

    const fetchAllNotite = async (materiiList) => {
        try {
            const allNotite = {};
            for (const materie of materiiList) {
                const data = await getAllNotite(materie.id);
                allNotite[materie.id] = data.data; // Associate notite with materie.id
            }
            setNotite(allNotite); // Update state with all notite
        } catch (err) {
            console.error('Error fetching notite:', err);
            alert('Failed to fetch notite. Please try again.');
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, []);

    // Fetch materii
    useEffect(() => {
        fetchMaterii();
    }, []);

    useEffect(() => {
        console.log('Current editingNotita:', editingNotita);
    }, [editingNotita]);
    

    return (
        <Container className="mt-4">
          <div className="container float-left">
            <div className="row">
              <div className="col">
                <h1 className="float-left">Bun venit in Dashboard</h1>
                <p>Aceasta este o zona protejata de parola, doar pentru <b>{user.nume} {user.prenume}</b>.</p>
              </div>
              <div className="col float-right text-right">

                <Button variant="danger" onClick={handleLogout} className="mt-3 float-right text-right" style={{float: 'right'}}>
                    Logout
                </Button>

                <Button variant="none" onClick={handleCreateGroup} className="mt-3 float-right text-right" style={{float: 'right'}}>
                    Creaza Grup de Studiu
                </Button>

                <Button variant="none" onClick={() => setShowAddMaterie((prev) => !prev)} className="mt-3 float-right text-right" style={{float: 'right'}}>
                    {showAddMaterie ? 'Renunta la adaugare' : 'Adauga o materie'}
                </Button>

              </div>
            </div>
          </div>

          <div className="container float-left">
            <div className="row">
              <div className="col">
                <h2>Materiile tale</h2>

                {/* Section 1: Add Materie */}
                <div id="section1" style={{ display: showAddMaterie ? 'block' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Adauga o materie noua"
                        value={newMaterie}
                        onChange={(e) => setNewMaterie(e.target.value)}
                        style={{ padding: '10px', width: '100%', flex: '1' }}
                    />
                    {/* buton salvare */}
                    <Button
                        variant="success"
                        onClick={() => {
                            handleAddMaterie();
                            fetchNotiteForMaterie();
                        }}
                    >
                        Salveaza materia
                    </Button>
                  </div>
                </div>

                {/* Section 2: Materii List */}
                <div id="section2" style={{ display: showAddMaterie ? 'none' : 'block' }}>
                    <ul>
                      {materii.length > 0 ? (
                          <ul>
                              {materii.map((materie) => (
                                  <li key={materie.id} className="float-left text-left" style={{ marginTop: '20px', listStyle: 'none', border: '1px solid #000', borderRadius: '5px', borderColor: '#dedede', padding: '10px' }}>
                                    <b>{materie.nume_materie}</b>
                                    <Button
                                      className=" float-right text-left"
                                      style={{float: 'right', background: 'none', border: '0', color: 'black', textAlign: 'right'}}
                                      onClick={() => setVisibleNotitaMaterie((prev) => prev === materie.id ? null : materie.id) } >
                                        {visibleNotitaMaterie ? 'Renunta la adaugare' : 'Adauga o notita'}
                                    </Button>

                                    {/* Notita Input Section */}
                                    {visibleNotitaMaterie === materie.id && (
                                        <div style={{ marginTop: '10px' }}>
                                          <MarkdownEditor
                                                notitaContent={notitaContent}
                                                setNotitaContent={setNotitaContent}
                                          />
                                            <textarea
                                                placeholder="Scrie o notita noua aici.."
                                                value={notitaContent}
                                                onChange={(e) => setNotitaContent(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '80px',
                                                    padding: '10px',
                                                    marginBottom: '10px',
                                                }}
                                            />
                                            <Button
                                                onClick={() => handleAddNotita(materie.id)}
                                                style={{ padding: '5px 10px' }}
                                            >
                                                Salveaza Notita
                                            </Button>
                                        </div>
                                    )}

                                    {/* Display Notite */}
                                    <ul>
                                    {notite[materie.id] && notite[materie.id].length > 0 ? (
                                        notite[materie.id].map((notita) => (
                                            <li key={notita.id} style={{ marginTop: '18px', listStyle: 'none' }}>

                                            {editingNotita?.id === notita.id ? ( // Check if editingNotita matches this notita
                                              <div>
                                                  {/* Markdown Editor */}
                                                  <MarkdownEditor
                                                      notitaContent={notitaContent}
                                                      setNotitaContent={handleContentChange}
                                                  />
                                                  <textarea
                                                      placeholder="Scrie o notita noua aici.."
                                                      value={notitaContent}
                                                      onChange={(e) => setNotitaContent(e.target.value)}
                                                      style={{
                                                          width: '100%',
                                                          height: '80px',
                                                          padding: '10px',
                                                          marginBottom: '10px',
                                                      }}
                                                  />
                                                  {/* Save Button */}
                                                  <Button onClick={handleSaveNotita} style={{ marginRight: '10px' }}>
                                                      Save
                                                  </Button>
                                                  {/* Cancel Button */}
                                                  <Button
                                                      onClick={() => {
                                                          setEditingNotita(null);
                                                          setNotitaContent('');
                                                      }}
                                                      style={{ marginRight: '10px' }}
                                                  >
                                                      Cancel
                                                  </Button>
                                              </div>
                                            ) : (

                                              <div>
                                                {/* Regular Notita Display */}
                                                <div style={{ position: 'relative', marginLeft: '0px', top: '0', right: '10px' }}>
                                                  {/* Edit Icon */}
                                                  <div
                                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                                    onClick={() => handleEditNotita(notita)} >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        style={{ cursor: 'pointer', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', color: 'blue' }}
                                                    />
                                                    <span>Edit</span>
                                                  </div>
                                                  {/* Delete Icon */}
                                                  <div
                                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                                    onClick={() => handleDeleteNotita(notita.id)} >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        style={{ cursor: 'pointer', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', color: 'blue' }}
                                                    />
                                                    <span>Sterge</span>
                                                  </div>
                                                  {/* Attachment Icon */}
                                                  <div
                                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                                    onClick={() => handleAddAttachment(notita)} >
                                                    <FontAwesomeIcon
                                                        icon={faPaperclip}
                                                        style={{ cursor: 'pointer', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', color: 'blue' }}
                                                    /> <span>Ataseaza</span>
                                                  </div>
                                                  {/* Tags Icon */}
                                                  <div
                                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                                    onClick={() => handleAddTags(notita)} >
                                                    <FontAwesomeIcon
                                                        icon={faTags}
                                                        style={{ cursor: 'pointer', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', color: 'blue' }}
                                                    />
                                                    <span>Etichetează</span>
                                                  </div>
                                                  {/* Tags Icon */}
                                                  <div
                                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                                    onClick={() => handleShareNotita(notita)} >
                                                    <FontAwesomeIcon
                                                        icon={faShareAlt}
                                                        style={{ cursor: 'pointer', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', color: 'blue' }}
                                                    />
                                                    <span>Share</span>
                                                  </div>
                                                </div>
                                                <MDEditor.Markdown source={notita.notita} />
                                              </div>
                                            )}

                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ marginTop: '0px', listStyle: 'none' }}>Nicio notita pentru aceasta materie</li>
                                    )}
                                    </ul>

                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p>Nicio materie disponibila!</p>
                      )}
                    </ul>
                </div>

              </div>
              <div className="col float-right text-right">

              </div>

            </div>
          </div>

        </Container>
    );
};

export default Dashboard;
