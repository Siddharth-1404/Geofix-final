
var selectedLocationMode = 'QR';
var selectedIssueCategory = 'Plumbing Leakage';


function formatUserName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function logoutUser() {
  sessionStorage.removeItem('currentUser');
}

function navigateToFeed() {
  window.location.href = 'feed.html';
}


function selectLocationMethod(method) {
  selectedLocationMode = method;
  var btnQR = document.getElementById('btnQR');
  var btnGPS = document.getElementById('btnGPS');
  var locationText = document.getElementById('locationText');

  if (method === 'QR') {
    if (btnQR) btnQR.classList.add('active');
    if (btnGPS) btnGPS.classList.remove('active');
    if (locationText) {
      locationText.innerHTML = '&#128247; Camera ready. Scan QR tag at facility.';
    }
  } else {
    if (btnGPS) btnGPS.classList.add('active');
    if (btnQR) btnQR.classList.remove('active');
    if (locationText) {
      locationText.innerHTML = '&#128205; GPS Location: <strong>Block 34, Central Campus (Accuracy: 5m)</strong>';
    }
  }
}


function setCategory(cat) {
  if (cat === 'Plumbing') {
    selectedIssueCategory = 'Plumbing Leakage';
  } else if (cat.indexOf('Issue') !== -1) {
    selectedIssueCategory = cat;
  } else {
    selectedIssueCategory = cat + ' Issue';
  }

  var actionBox = document.getElementById('aiActionButtons');
  if (actionBox) {
    actionBox.innerHTML = '<span style="color:#059669; font-weight:bold;">✓ Category Selected: ' + cat + '</span>';
  }
}

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    var fileName = input.files[0].name;
    var uploadLabel = document.getElementById('uploadLabel');
    if (uploadLabel) {
      uploadLabel.innerText = '✓ Attached: ' + fileName;
    }
    
    // Simulate AI Image Classification Pipeline
    var processingBox = document.getElementById('aiProcessingBox');
    var verdictBox = document.getElementById('aiVerdictBox');
    
    if (processingBox && verdictBox) {
      processingBox.style.display = 'flex';
      verdictBox.style.display = 'none';

      setTimeout(function() {
        processingBox.style.display = 'none';
        verdictBox.style.display = 'block';
      }, 1500);
    }
  }
}

function handleTicketSubmit(event) {
  event.preventDefault();
  alert('Ticket #TKT-105 submitted successfully!');

  var issueTitle = selectedIssueCategory || 'Plumbing Leakage';

  var recentList = document.getElementById('recentReportsList');
  if (recentList) {
    var newItem = document.createElement('li');
    newItem.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;';
    newItem.innerHTML = 
      '<div>' +
        '<strong style="font-size: 13px; display: block;">' + issueTitle + ' (Block 34)</strong>' +
        '<small style="color: #9ca3af;">Ticket #TKT-105 &bull; Just Now</small>' +
      '</div>' +
      '<span class="badge badge-pending">Pending</span>';

    recentList.insertBefore(newItem, recentList.firstChild);
  }
}


function toggleProposalForm() {
  var formCard = document.getElementById('proposalFormCard');
  if (!formCard) return;
  if (formCard.style.display === 'none' || formCard.style.display === '') {
    formCard.style.display = 'block';
    formCard.scrollIntoView({ behavior: 'smooth' });
  } else {
    formCard.style.display = 'none';
  }
}

function joinInitiativeTeam(buttonEl) {
  buttonEl.innerText = '✓ Joined';
  buttonEl.disabled = true;
  buttonEl.style.opacity = '0.7';
}

function handleNewIdea(event) {
  event.preventDefault();

  var title = document.getElementById('ideaTitle').value.trim();
  var location = document.getElementById('ideaLocation').value.trim();
  var desc = document.getElementById('ideaDesc').value.trim();
  var photoInput = document.getElementById('ideaPhoto');

  if (!title || !desc) {
    alert('Please fill in title and description.');
    return;
  }

  var imgHTML = '';
  if (photoInput && photoInput.files && photoInput.files[0]) {
    var imgURL = URL.createObjectURL(photoInput.files[0]);
    imgHTML = '<img src="' + imgURL + '" alt="Proposal Photo" class="idea-image">';
  }

  var feedContainer = document.getElementById('feedContainer');
  var newCard = document.createElement('article');
  newCard.className = 'idea-card';
  newCard.innerHTML = 
    imgHTML +
    '<h3>' + title + ' (' + location + ')</h3>' +
    '<p>' + desc + '</p>' +
    '<p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">' +
      'Proposed by: <strong>You (Student)</strong>' +
    '</p>' +
    '<footer class="idea-footer">' +
      '<span class="vote-counter">1 / 50 Upvotes</span>' +
      '<button type="button" class="btn-vote" disabled style="opacity: 0.6;">&#10003; Upvoted</button>' +
    '</footer>';

  if (feedContainer) {
    feedContainer.insertBefore(newCard, feedContainer.firstChild);
  }

  // Reset & close form
  document.getElementById('ideaTitle').value = '';
  document.getElementById('ideaLocation').value = '';
  document.getElementById('ideaDesc').value = '';
  if (photoInput) photoInput.value = '';
  toggleProposalForm();

  alert('New initiative posted successfully!');
}

function upvoteIdea(counterId) {
  var counterEl = document.getElementById(counterId);
  if (!counterEl) return;

  var currentText = counterEl.innerText;
  var currentVotes = parseInt(currentText.split('/')[0].trim());

  if (currentVotes < 50) {
    currentVotes += 1;
    counterEl.innerText = currentVotes + ' / 50 Upvotes';

    if (currentVotes >= 50) {
      alert('Congratulations! This initiative reached 50 votes and is sent for Admin Review.');
    }
  }
}


function applyRoleBasedDashboard(role) {
  var user = role || sessionStorage.getItem('currentUser') || sessionStorage.getItem('loggedInUser') || 'admin';
  user = user.toLowerCase();

  var pageTitle = document.getElementById('adminPageTitle');
  var pageSubtitle = document.getElementById('adminPageSubtitle');
  var welcomeText = document.getElementById('adminWelcomeText');
  var maintenanceSection = document.getElementById('maintenance-only');
  var welfareSection = document.getElementById('welfare-ideas-section');
  var rows = document.querySelectorAll('#tableBody tr');

  if (user.indexOf('welfare') !== -1) {
    // 1. Student Welfare Role
    if (pageTitle) pageTitle.innerText = 'Student Welfare Wing Dashboard';
    if (pageSubtitle) pageSubtitle.innerText = 'Review and approve qualified student initiatives with 50+ community upvotes.';
    if (welcomeText) welcomeText.innerHTML = 'Welcome, <strong>Student Welfare Officer</strong>';
    if (maintenanceSection) maintenanceSection.style.display = 'none';
    if (welfareSection) welfareSection.style.display = 'block';

  } else if (user.indexOf('warden') !== -1) {
    // 2. Hostel Warden Role
    if (pageTitle) pageTitle.innerText = 'Hostel BH7 - Warden Dashboard';
    if (pageSubtitle) pageSubtitle.innerText = 'Manage and resolve facilities complaints for Hostel BH7 & residential blocks.';
    if (welcomeText) welcomeText.innerHTML = 'Welcome, <strong>Hostel Warden</strong>';
    if (welfareSection) welfareSection.style.display = 'none';
    if (maintenanceSection) maintenanceSection.style.display = 'block';

    
    for (var i = 0; i < rows.length; i++) {
      var loc = rows[i].cells[3].innerText;
      rows[i].style.display = (loc.indexOf('Hostel') !== -1 || loc.indexOf('BH') !== -1) ? '' : 'none';
    }

    var statTotal = document.getElementById('statTotal');
    var statPending = document.getElementById('statPending');
    var statResolved = document.getElementById('statResolved');
    if (statTotal) statTotal.innerText = '1';
    if (statPending) statPending.innerText = '0';
    if (statResolved) statResolved.innerText = '1';

  } else {
   
    if (pageTitle) pageTitle.innerText = 'University Master Dashboard';
    if (pageSubtitle) pageSubtitle.innerText = 'Overview of all campus maintenance complaints and infrastructure tickets.';
    if (welcomeText) welcomeText.innerHTML = 'Welcome, <strong>Master Admin</strong>';
    if (welfareSection) welfareSection.style.display = 'none';
    if (maintenanceSection) maintenanceSection.style.display = 'block';

    for (var j = 0; j < rows.length; j++) {
      rows[j].style.display = '';
    }

    var statTotalAll = document.getElementById('statTotal');
    var statPendingAll = document.getElementById('statPending');
    var statResolvedAll = document.getElementById('statResolved');
    if (statTotalAll) statTotalAll.innerText = '4';
    if (statPendingAll) statPendingAll.innerText = '3';
    if (statResolvedAll) statResolvedAll.innerText = '1';
  }
}

function reviewProposal(decision) {
  var actionsBox = document.getElementById('welfareActionButtons');
  if (decision === 'approved') {
    if (actionsBox) {
      actionsBox.innerHTML = '<span style="color: #059669; font-weight: bold; font-size: 13px;">✓ Approved (Budget Allocated)</span>';
    }
  } else {
    if (actionsBox) {
      actionsBox.innerHTML = '<span style="color: #dc2626; font-weight: bold; font-size: 13px;">✗ Proposal Rejected</span>';
    }
  }
}

function resolveTicket(buttonElement, ticketId) {
  var confirmResolve = confirm('Are you sure you want to mark ' + ticketId + ' as Resolved?');
  if (!confirmResolve) return;

  var row = buttonElement.closest('tr');
  row.setAttribute('data-status', 'Resolved');

  var statusCell = row.cells[5];
  statusCell.innerHTML = '<span class="badge badge-resolved">Resolved</span>';

  var actionCell = row.cells[6];
  actionCell.innerHTML = '<span style="color: #6b7280; font-size: 12px;">Completed</span>';

  var pendingEl = document.getElementById('statPending');
  var resolvedEl = document.getElementById('statResolved');

  if (pendingEl && resolvedEl) {
    var currentPending = parseInt(pendingEl.innerText);
    var currentResolved = parseInt(resolvedEl.innerText);

    if (currentPending > 0) {
      pendingEl.innerText = currentPending - 1;
      resolvedEl.innerText = currentResolved + 1;
    }
  }
}


function redeemPoints(voucherName, cost) {
  var balanceEl = document.getElementById('civicBalance');
  if (!balanceEl) return;

  var currentBalance = parseInt(balanceEl.innerText);

  if (currentBalance < cost) {
    alert('Insufficient civic points to redeem this item.');
    return;
  }

  var confirmed = confirm('Do you want to redeem ' + voucherName + ' for ' + cost + ' points?');
  if (confirmed) {
    currentBalance -= cost;
    balanceEl.innerText = currentBalance;
    alert('Voucher generated for ' + voucherName + '! Check your student email.');
  }
}


document.addEventListener('DOMContentLoaded', function() {
  
  // Theme reset
  document.body.classList.remove('dark-mode');
  localStorage.removeItem('geofix-theme');

  
  var savedUser = sessionStorage.getItem('currentUser');
  var studentNameEl = document.getElementById('studentName');
  if (studentNameEl && savedUser) {
    studentNameEl.innerText = formatUserName(savedUser);
  }

  // Admin Dashboard RBAC initialization
  if (document.getElementById('adminPageTitle')) {
    applyRoleBasedDashboard();
  }

  // Login form handler (index.html)
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var submitBtn = document.getElementById('submitBtn');

    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var username = usernameInput.value.trim();
      var password = passwordInput.value.trim();

      if (username === '') {
        alert('Please enter your username.');
        usernameInput.focus();
        return;
      }
      if (password === '') {
        alert('Please enter your password.');
        passwordInput.focus();
        return;
      }

      submitBtn.innerText = 'Verifying...';
      submitBtn.disabled = true;
      sessionStorage.setItem('currentUser', username);

      setTimeout(function() {
        var lower = username.toLowerCase();
        if (lower.indexOf('admin') !== -1 || lower.indexOf('warden') !== -1 || lower.indexOf('welfare') !== -1) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 500);
    });
  }
});
