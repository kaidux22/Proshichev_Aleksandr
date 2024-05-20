import matplotlib.pyplot as plt
import matplotlib.animation as animation
import sys


fig = plt.figure()
ax = plt.axes()


def animate(i):
    data = open(sys.argv[1], 'r').read()
    lines = data.split('\n')
    time, dist = [], []

    for line in lines:
        if line == '':
            break
        tm, dst = line.split()
        time.append(float(tm))
        dist.append(float(dst))
        
    ax.clear()
    ax.plot(time, dist)

    plt.xlabel('время [сутки]')
    plt.ylabel('расстояние [км]')
    #plt.zlabel('z')
    plt.title('Дифференциальные межспутниковые измерения')


ani = animation.FuncAnimation(fig, animate, interval=10)
plt.show()
