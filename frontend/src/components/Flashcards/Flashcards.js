import React, { useState, useEffect } from 'react';
import { 
  Brain,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  X,
  Plus,
  Shuffle,
  TrendingUp,
  Book
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { mockFlashcards } from '../../mock/mockData';

const Flashcards = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('all'); // all, due, difficult
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [filteredCards, setFilteredCards] = useState([]);
  const [isStudySession, setIsStudySession] = useState(false);

  const subjects = ['all', 'Physics', 'Chemistry', 'Mathematics'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500', 
    hard: 'bg-red-500'
  };

  useEffect(() => {
    filterCards();
  }, [studyMode, selectedSubject]);

  const filterCards = () => {
    let filtered = [...mockFlashcards];
    
    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(card => card.subject === selectedSubject);
    }
    
    // Filter by study mode
    switch (studyMode) {
      case 'due':
        filtered = filtered.filter(card => {
          const nextReview = new Date(card.nextReview);
          const today = new Date();
          return nextReview <= today;
        });
        break;
      case 'difficult':
        filtered = filtered.filter(card => card.difficulty === 'hard');
        break;
      default:
        break;
    }
    
    setFilteredCards(filtered);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const markAnswer = (isCorrect) => {
    setSessionStats(prev => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1,
      total: prev.total + 1
    }));
    
    // Auto advance after marking
    setTimeout(() => {
      nextCard();
    }, 500);
  };

  const startStudySession = () => {
    setIsStudySession(true);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const endStudySession = () => {
    setIsStudySession(false);
  };

  const calculateSessionAccuracy = () => {
    if (sessionStats.total === 0) return 0;
    return Math.round((sessionStats.correct / sessionStats.total) * 100);
  };

  const getDueCardsCount = () => {
    const today = new Date();
    return mockFlashcards.filter(card => {
      const nextReview = new Date(card.nextReview);
      return nextReview <= today;
    }).length;
  };

  const currentCard = filteredCards[currentCardIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flashcards & Revision
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Master concepts with spaced repetition learning
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isStudySession && (
            <Button onClick={startStudySession} className="flex items-center space-x-1">
              <Brain size={16} />
              <span>Start Study Session</span>
            </Button>
          )}
          {isStudySession && (
            <Button variant="outline" onClick={endStudySession} className="flex items-center space-x-1">
              <X size={16} />
              <span>End Session</span>
            </Button>
          )}
        </div>
      </div>

      {!isStudySession ? (
        <>
          {/* Study Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                studyMode === 'all' 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg'
              }`}
              onClick={() => setStudyMode('all')}
            >
              <div className="text-center">
                <Book className={`w-8 h-8 mx-auto mb-2 ${studyMode === 'all' ? 'text-white' : 'text-teal-600'}`} />
                <h3 className={`font-semibold mb-1 ${studyMode === 'all' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  All Cards
                </h3>
                <p className={`text-sm ${studyMode === 'all' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                  {mockFlashcards.length} cards
                </p>
              </div>
            </Card>

            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                studyMode === 'due' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                  : 'bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg'
              }`}
              onClick={() => setStudyMode('due')}
            >
              <div className="text-center">
                <Clock className={`w-8 h-8 mx-auto mb-2 ${studyMode === 'due' ? 'text-white' : 'text-orange-600'}`} />
                <h3 className={`font-semibold mb-1 ${studyMode === 'due' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Due for Review
                </h3>
                <p className={`text-sm ${studyMode === 'due' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                  {getDueCardsCount()} cards
                </p>
              </div>
            </Card>

            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                studyMode === 'difficult' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                  : 'bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg'
              }`}
              onClick={() => setStudyMode('difficult')}
            >
              <div className="text-center">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${studyMode === 'difficult' ? 'text-white' : 'text-red-600'}`} />
                <h3 className={`font-semibold mb-1 ${studyMode === 'difficult' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Difficult
                </h3>
                <p className={`text-sm ${studyMode === 'difficult' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                  {mockFlashcards.filter(c => c.difficulty === 'hard').length} cards
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Create New</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add flashcard</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                <Button size="sm" variant="outline" onClick={shuffleCards} className="flex items-center space-x-1">
                  <Shuffle size={16} />
                  <span>Shuffle</span>
                </Button>
                <Badge variant="outline">{filteredCards.length} cards</Badge>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Study Session Header */
        <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Study Session Active</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                <p className="text-lg font-bold text-green-600">{sessionStats.correct}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
                <p className="text-lg font-bold text-red-600">{sessionStats.incorrect}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                <p className="text-lg font-bold text-teal-600">{calculateSessionAccuracy()}%</p>
              </div>
            </div>
          </div>
          <Progress value={(currentCardIndex / filteredCards.length) * 100} className="mt-3 h-2" />
        </Card>
      )}

      {/* Flashcard Display */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center space-y-6">
          {/* Card */}
          <div 
            className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <Card className={`absolute w-full h-full backface-hidden bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 ${!isFlipped ? 'z-10' : ''}`}>
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${difficultyColors[currentCard.difficulty]}`}></div>
                      <span className="capitalize">{currentCard.difficulty}</span>
                    </Badge>
                    <Badge variant="secondary">{currentCard.subject}</Badge>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Question</h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentCard.question}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Topic: {currentCard.topic}</span>
                    <span>Click to reveal answer</span>
                  </div>
                </div>
              </Card>

              {/* Back */}
              <Card className={`absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700 hover:shadow-xl transition-all duration-300 ${isFlipped ? 'z-10' : ''}`}>
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-teal-500 text-white">Answer</Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star size={16} />
                      <span>Last reviewed: {currentCard.lastReviewed}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                        {currentCard.answer}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Next review: {currentCard.nextReview}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center space-x-1"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </Button>

            {isFlipped && isStudySession && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => markAnswer(false)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                  <span>Incorrect</span>
                </Button>
                <Button
                  onClick={() => markAnswer(true)}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle size={16} />
                  <span>Correct</span>
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentCardIndex === filteredCards.length - 1}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Card {currentCardIndex + 1} of {filteredCards.length}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <Brain size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Cards Available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No flashcards match your current filters. Try selecting a different study mode or subject.
          </p>
          <Button onClick={() => { setStudyMode('all'); setSelectedSubject('all'); }}>
            Show All Cards
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Flashcards;