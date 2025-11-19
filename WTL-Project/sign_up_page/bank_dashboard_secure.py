from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a strong secret key

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    balance = db.Column(db.Float, default=2345.67)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        uname = request.form.get('username')
        pwd = request.form.get('password')
        if not uname or not pwd:
            return "Please enter username and password"
        
        user = User.query.filter_by(username=uname).first()
        if user and check_password_hash(user.password, pwd):
            session['user_id'] = user.id
            return redirect('/account')
        else:
            return "Invalid username or password"
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        uname = request.form.get('username')
        pwd = request.form.get('password')
        if not uname or not pwd:
            return "Please enter username and password"
        
        hashed_pwd = generate_password_hash(pwd)
        new_user = User(username=uname, password=hashed_pwd)
        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect('/')
        except Exception as e:
            db.session.rollback()
            return "Username already exists or database error: " + str(e)
    return render_template('html2.html')

@app.route('/account')
def account():
    if 'user_id' not in session:
        return redirect('/')
    user = User.query.get(session['user_id'])
    if not user:
        return redirect('/')
    return render_template('accounts.html', user=user)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

if __name__ == '__main__':
    if not os.path.exists('users.db'):
        with app.app_context():
            db.create_all()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
